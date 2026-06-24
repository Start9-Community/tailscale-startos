import type { HealthCheckResult } from '@start9labs/start-sdk/package/lib/health/checkFns'
import { Daemons } from '@start9labs/start-sdk/package/lib/mainFn/Daemons'
import { i18n } from './i18n'
import { manifest } from './manifest'
import { sdk } from './sdk'
import { serveConfig } from './fileModels/serveConfig'
import {
  DEVICE_NAME,
  SOCKET,
  STATE_DIR,
  STATUS_FILE,
  WEB_UI_PORT,
  targetSchemeFor,
} from './utils'

const TS = `tailscale --socket=${SOCKET}`

export const main = sdk.setupMain(async ({ effects }) => {
  // Reactive: adding or removing a serve rewrites this list, which re-runs main and
  // rebuilds the forwarder/apply set. The brief tailscaled reconnect on change is fine.
  const routes = (await serveConfig.read((c) => c.routes).const(effects)) ?? []

  const sub = await sdk.SubContainer.of(
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

  const checkTailscaleHealth = async (): Promise<HealthCheckResult> => {
    const res = await sub.exec(
      ['tailscale', `--socket=${SOCKET}`, 'status', '--json'],
      {},
      5000,
    )
    if (res.exitCode !== 0) {
      return { result: 'failure', message: i18n('Tailscaled is not ready') }
    }
    try {
      const state = (
        JSON.parse(String(res.stdout)) as { BackendState?: string }
      ).BackendState
      switch (state) {
        case 'Running':
          return { result: 'success', message: i18n('Tailscaled is running') }
        case 'NeedsLogin':
        case 'NeedsMachineAuth':
          return {
            result: 'success',
            message: i18n('Tailscale is waiting for login'),
          }
        default:
          return { result: 'loading', message: i18n('Tailscaled is starting') }
      }
    } catch {
      return { result: 'failure', message: i18n('Tailscaled is not ready') }
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
      command: [
        'tailscale',
        `--socket=${SOCKET}`,
        'web',
        '--listen',
        `0.0.0.0:${WEB_UI_PORT}`,
      ],
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
  // localhost:<localPort> -> <target container IP>:<internal port>).
  const applicable: {
    route: (typeof routes)[number]
    scheme: string
    fwId: string
  }[] = []
  for (const route of routes) {
    const iface = await sdk.serviceInterface
      .get(effects, { packageId: route.packageId, id: route.interfaceId })
      .once()
    if (!iface?.addressInfo) continue
    const scheme = targetSchemeFor(iface.addressInfo)
    if (!scheme) continue
    const containerIp = await sdk
      .getContainerIp(effects, { packageId: route.packageId })
      .once()

    const fwId = `fwd-${route.id}`
    daemons = daemons.addDaemon(fwId as never, {
      subcontainer: sub,
      exec: {
        command: [
          'socat',
          `TCP-LISTEN:${route.localPort},fork,reuseaddr`,
          `TCP:${containerIp}:${iface.addressInfo.internalPort}`,
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
      const target = `${scheme}://localhost:${route.localPort}`
      const command: [string, ...string[]] =
        route.mode === 'funnel'
          ? [
              'tailscale',
              `--socket=${SOCKET}`,
              'funnel',
              '--bg',
              `--https=${route.externalPort}`,
              target,
            ]
          : [
              'tailscale',
              `--socket=${SOCKET}`,
              'serve',
              '--bg',
              `--${route.mode === 'http' ? 'http' : 'https'}=${route.externalPort}`,
              target,
            ]
      daemons = daemons.addOneshot(`apply-${route.id}` as never, {
        subcontainer: sub,
        exec: { command },
        requires: ['serve-reset', fwId],
      })
    }
  }

  return daemons
})
