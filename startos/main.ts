import type { HealthCheckResult } from '@start9labs/start-sdk/lib/health/checkFns'
import { Daemons } from '@start9labs/start-sdk'
import { i18n } from './i18n'
import { manifest } from './manifest'
import { sdk } from './sdk'
import { serveConfig, serveModeLabel } from './fileModels/serveConfig'
import {
  DEVICE_NAME,
  SOCKET,
  STATE_DIR,
  STATUS_FILE,
  WEB_UI_PORT,
  routeHostId,
  serveActive,
  serveTarget,
  targetSchemeFor,
  type ServeStatus,
} from './utils'

const TS = `tailscale --socket=${SOCKET}`
const tailscale = (...args: string[]): [string, ...string[]] => [
  'tailscale',
  `--socket=${SOCKET}`,
  ...args,
]

export const main = sdk.setupMain(async ({ effects }) => {
  // Reactive: adding or removing a serve rewrites this list, which re-runs main and
  // rebuilds the forwarder/apply set. The brief tailscaled reconnect on change is fine.
  const routes = (await serveConfig.read((c) => c.routes).const(effects)) ?? []

  const sub = sdk.SubContainer.of(
    effects,
    { imageId: 'tailscale' },
    sdk.Mounts.of().mountVolume({
      volumeId: 'main',
      subpath: null,
      mountpoint: STATE_DIR,
      readonly: false,
    }),
    'tailscale-sub',
  )

  const backendState = async () => {
    const res = await sub.exec(tailscale('status', '--json'), {}, 5000)
    if (res.exitCode !== 0) return null
    try {
      return (
        (JSON.parse(String(res.stdout)) as { BackendState?: string })
          .BackendState ?? null
      )
    } catch {
      return null
    }
  }

  const checkTailscaleHealth = async (): Promise<HealthCheckResult> => {
    switch (await backendState()) {
      case 'Running':
        return { result: 'success', message: i18n('Tailscaled is running') }
      case 'NeedsLogin':
      case 'NeedsMachineAuth':
        return {
          result: 'success',
          message: i18n('Tailscale is waiting for login'),
        }
      case null:
        return { result: 'failure', message: i18n('Tailscaled is not ready') }
      default:
        return { result: 'loading', message: i18n('Tailscaled is starting') }
    }
  }

  // Ids are widened to `string` and cast `as never` so a variable number of
  // forwarder/apply daemons can be added in a loop (the same pattern holesail
  // uses). `requires` is matched against ids at runtime.
  let daemons: Daemons<typeof manifest, string> = sdk.Daemons.of(effects)
  daemons = daemons.addDaemon('tailscaled' as never, {
    subcontainer: sub,
    exec: {
      // Set a friendly default device name before tailscaled registers — otherwise
      // it adopts the random subcontainer hostname and the node (and every exported
      // serve URL) shows up as `<random>.<tailnet>.ts.net`. tailscaled reads the OS
      // hostname at startup; this only sets the *default*, so a rename in the
      // Tailscale console still wins. Falls back silently if the host can't be set.
      command: [
        'sh',
        '-c',
        `hostname ${DEVICE_NAME} 2>/dev/null || true; exec tailscaled --state=${STATE_DIR}/tailscaled.state --socket=${SOCKET} --tun=userspace-networking`,
      ],
    },
    ready: { display: i18n('Tailscale Daemon'), fn: checkTailscaleHealth },
    requires: [],
  })
  daemons = daemons.addDaemon('web' as never, {
    subcontainer: sub,
    exec: {
      command: tailscale('web', '--listen', `0.0.0.0:${WEB_UI_PORT}`),
    },
    ready: {
      display: i18n('Tailscale Admin Interface'),
      fn: () =>
        sdk.healthCheck.checkPortListening(effects, WEB_UI_PORT, {
          successMessage: i18n('Admin interface is reachable'),
          errorMessage: i18n('Admin interface is not reachable'),
        }),
    },
    requires: ['tailscaled'],
  })

  // Resolve each saved serve to its live target and stand up one socat forwarder
  // per route (tailscale serve only proxies to localhost, so the forwarder bridges
  // localhost:<localPort> -> the target's LXC-bridge <host>:<port>). The target is
  // read reactively, so a reinstalled or re-addressed service re-resolves.
  const applicable: {
    route: (typeof routes)[number]
    scheme: string
    fwId: string
  }[] = []
  for (const route of routes) {
    const hostId = await routeHostId(effects, route)
    if (!hostId) continue
    // `https+insecure` targets the OS-terminated SSL bridge port; http/tcp the
    // plaintext one.
    const target = await sdk.host
      .get(effects, { hostId, packageId: route.packageId }, (host) =>
        serveTarget(host, route.interfaceId),
      )
      .const()
    if (!target) continue
    // TCP routes forward any port; the web modes need an HTTP(S) target for serve.
    const scheme = route.mode === 'tcp' ? 'tcp' : targetSchemeFor(target)
    if (!scheme) continue
    const addr = scheme === 'https+insecure' ? target.ssl : target.plain
    if (!addr) continue

    const fwId = `fwd-${route.id}`
    daemons = daemons.addDaemon(fwId as never, {
      subcontainer: sub,
      exec: {
        command: [
          'socat',
          `TCP-LISTEN:${route.localPort},fork,reuseaddr`,
          `TCP:${addr.hostname}:${addr.port}`,
        ],
      },
      ready: {
        display: null,
        fn: () =>
          sdk.healthCheck.checkPortListening(effects, route.localPort, {
            successMessage: i18n('Forwarder is listening'),
            errorMessage: i18n('Forwarder is not listening'),
          }),
      },
      requires: ['tailscaled'],
    })
    applicable.push({ route, scheme, fwId })
  }

  // Login happens out-of-band in the admin UI, so wait for the node to reach
  // `Running`, then record `tailscale status` to the volume — even with no serves
  // configured — so the host side can read the MagicDNS name for the url-v0 exports
  // right after sign-in (no serve add needed to trigger it). The in-place `>` write
  // keeps the inode the host's FileHelper watch is bound to; an atomic tmp+mv would
  // replace it and the watch would miss the update.
  const waitForRunning = `until ${TS} status --json 2>/dev/null | grep -qE '"BackendState"[[:space:]]*:[[:space:]]*"Running"'; do sleep 2; done`
  daemons = daemons.addOneshot('write-status' as never, {
    subcontainer: sub,
    exec: {
      command: [
        'sh',
        '-c',
        `${waitForRunning}; ${TS} status --json > ${STATUS_FILE} 2>/dev/null || true`,
      ],
    },
    requires: ['tailscaled'],
  })

  if (applicable.length > 0) {
    // Clear any stale serve/funnel config before re-applying the current set.
    daemons = daemons.addOneshot('serve-reset' as never, {
      subcontainer: sub,
      exec: {
        command: [
          'sh',
          '-c',
          `${TS} serve reset || true; ${TS} funnel reset || true`,
        ],
      },
      requires: ['write-status'],
    })

    for (const { route, scheme, fwId } of applicable) {
      // A target's SSL bridge port answers only SNI-less connections, which an IP literal guarantees.
      const target = `${scheme}://127.0.0.1:${route.localPort}`
      const command =
        route.mode === 'funnel'
          ? tailscale('funnel', '--bg', `--https=${route.externalPort}`, target)
          : route.mode === 'tcp'
            ? tailscale('serve', '--bg', `--tcp=${route.externalPort}`, target)
            : tailscale(
                'serve',
                '--bg',
                `--${route.mode}=${route.externalPort}`,
                target,
              )
      daemons = daemons.addOneshot(`apply-${route.id}` as never, {
        subcontainer: sub,
        exec: { command },
        requires: ['serve-reset', fwId],
      })
    }
  }

  // `tailscale serve --bg` can exit 0 without applying anything (HTTPS
  // Certificates not enabled for the tailnet, Funnel not enabled), so the apply
  // oneshots prove nothing on their own: compare tailscaled's live serve config
  // against the routes that should be in it.
  const checkServes = async (): Promise<HealthCheckResult> => {
    if (applicable.length === 0) {
      return { result: 'disabled', message: i18n('No interfaces are served') }
    }
    if ((await backendState()) !== 'Running') {
      return {
        result: 'waiting',
        message: i18n('Sign this node in to your tailnet to serve interfaces'),
      }
    }
    const res = await sub.exec(tailscale('serve', 'status', '--json'), {}, 5000)
    if (res.exitCode !== 0) {
      return {
        result: 'failure',
        message: i18n('Could not read the serve configuration from tailscaled'),
      }
    }
    const status: ServeStatus = JSON.parse(String(res.stdout)) ?? {}
    const missing = applicable.filter(
      ({ route }) => !serveActive(status, route),
    )
    if (missing.length === 0) {
      return { result: 'success', message: i18n('All serves are active') }
    }
    return {
      result: 'failure',
      message: i18n(
        'Not active: ${routes}. HTTPS and Funnel serves need HTTPS Certificates enabled for your tailnet in the Tailscale admin console, and Funnel needs Funnel enabled.',
        {
          routes: missing
            .map(({ route }) =>
              i18n('${title} → ${iface} (${mode}, port ${port})', {
                title: route.packageTitle,
                iface: route.interfaceName,
                mode: serveModeLabel(route.mode),
                port: String(route.externalPort),
              }),
            )
            .join(', '),
        },
      ),
    }
  }
  daemons = daemons.addHealthCheck('serve' as never, {
    ready: {
      display: i18n('Tailscale Serve'),
      fn: checkServes,
      gracePeriod: 30_000,
      trigger: sdk.trigger.statusTrigger(30_000, {
        starting: 1_000,
        waiting: 5_000,
        failure: 5_000,
      }),
    },
    // Requiring the apply oneshots instead would hide a hard-failing one behind a bare "waiting".
    requires: ['tailscaled'],
  })

  return daemons
})
