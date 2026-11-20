import { T, utils } from '@start9labs/start-sdk'
import { i18n } from './i18n'
import { sdk } from './sdk'
import { STATUS_FILE_SUBPATH } from './fileModels/status'
import {
  serveUsesTailnetTls,
  type ServeMode,
  type ServeRoute,
} from './fileModels/serveConfig'

/** Find a filled interface by id across a resolved host's bindings. */
export const findIface = (host: utils.FilledHost | null, interfaceId: string) =>
  (host &&
    Object.values(host.bindings)
      .flatMap((b) => Object.values(b.interfaces))
      .find((i) => i.id === interfaceId)) ||
  undefined

/**
 * The host id a route targets: the one captured at add-time, or, for a route
 * saved before it was stored, derived once from the interface.
 */
export const routeHostId = async (
  effects: T.Effects,
  route: { packageId: string; interfaceId: string; hostId?: string },
) =>
  route.hostId ??
  (
    await effects.getServiceInterface({
      packageId: route.packageId,
      serviceInterfaceId: route.interfaceId,
    })
  )?.addressInfo?.hostId

/** Whether a route's target interface still exists on an installed package. */
export const routeTargetExists = async (
  effects: T.Effects,
  route: { packageId: string; interfaceId: string; hostId?: string },
) => {
  const hostId = await routeHostId(effects, route)
  if (!hostId) return false
  const host = await sdk.host
    .get(effects, { hostId, packageId: route.packageId })
    .once()
  return !!findIface(host, route.interfaceId)?.addressInfo
}

/**
 * The IPv4 LXC-bridge `{ hostname, port }` for the interface on a binding of an
 * already-resolved host. `<pkg>.startos` DNS and container IPs (getContainerIp)
 * are deprecated; containers — and the OS admin UI (`start-os`/`admin`, which
 * has no container of its own) — are reached over this bridge. `ssl` picks the
 * https vs http variant. Returns `undefined` when the binding exports no
 * bridge-reachable interface.
 */
export const bridgeHost = (
  host: utils.FilledHost | null,
  internalPort: number,
  ssl: boolean,
) => {
  const binding = host?.bindings[internalPort]
  const iface = binding && Object.values(binding.interfaces)[0]
  const h = iface
    ? iface.addressInfo.filter({
        kind: 'bridge',
        predicate: (h) => h.metadata.kind === 'ipv4' && h.ssl === ssl,
      }).hostnames[0]
    : undefined
  return h && { hostname: h.hostname, port: h.port }
}

/**
 * What a serve needs of its target interface: the schemes it advertises and
 * its bridge address on each leg. Plain data, so a host read mapped through it
 * re-runs its context only when one of these changes.
 */
export const serveTarget = (
  host: utils.FilledHost | null,
  interfaceId: string,
) => {
  const info = findIface(host, interfaceId)?.addressInfo
  return info
    ? {
        scheme: info.scheme ?? null,
        sslScheme: info.sslScheme ?? null,
        plain: bridgeHost(host, info.internalPort, false) ?? null,
        ssl: bridgeHost(host, info.internalPort, true) ?? null,
      }
    : null
}

// Runtime paths inside the container. The tailscaled socket lives on the `main`
// volume so the serve-apply oneshots and the actions' temporary subcontainers can
// all reach it.
export const STATE_DIR = '/var/lib/tailscale'
export const SOCKET = `${STATE_DIR}/tailscaled.sock`
export const STATUS_FILE = `${STATE_DIR}${STATUS_FILE_SUBPATH}`

/** Default device name set before tailscaled registers (user-overridable in the Tailscale console). */
export const DEVICE_NAME = 'startos'

/**
 * How tailscaled should dial the local socat forwarder for this interface.
 * Returns null when the interface advertises no HTTP(S) endpoint (can't be served).
 * A TLS serve prefers the SSL leg: StartOS sets `X-Forwarded-Proto: https` only there.
 */
export function targetSchemeFor(
  addressInfo: { scheme?: string | null; sslScheme?: string | null },
  preferSsl = false,
): 'http' | 'https+insecure' | null {
  const plain = addressInfo.scheme?.startsWith('http')
  const ssl = addressInfo.sslScheme?.startsWith('http')
  if (ssl && (preferSsl || !plain)) return 'https+insecure'
  if (plain) return 'http'
  return null
}

/** The parts of `tailscale serve status --json` the serve health check reads. */
export type ServeStatus = {
  TCP?: Record<string, { HTTP?: boolean; HTTPS?: boolean; TCPForward?: string }>
  Web?: Record<string, { Handlers?: Record<string, { Proxy?: string }> }>
  AllowFunnel?: Record<string, boolean>
}

/** Whether tailscaled's serve config carries this route, forwarder and all. */
export function serveActive(
  status: ServeStatus,
  route: Pick<ServeRoute, 'mode' | 'externalPort' | 'localPort'>,
): boolean {
  const port = `:${route.externalPort}`
  const forwarder = `127.0.0.1:${route.localPort}`
  const tcp = status.TCP?.[route.externalPort]
  if (route.mode === 'tcp') return tcp?.TCPForward === forwarder
  const web = Object.entries(status.Web ?? {}).some(
    ([hostPort, site]) =>
      hostPort.endsWith(port) &&
      Object.values(site.Handlers ?? {}).some((h) =>
        h.Proxy?.includes(forwarder),
      ),
  )
  const funnel =
    route.mode !== 'funnel' ||
    Object.entries(status.AllowFunnel ?? {}).some(
      ([hostPort, allowed]) => allowed && hostPort.endsWith(port),
    )
  return (
    !!(serveUsesTailnetTls(route.mode) ? tcp?.HTTPS : tcp?.HTTP) &&
    web &&
    funnel
  )
}

/** The URL another Tailscale device uses to reach a served interface. */
export function buildTailnetUrl(
  mode: ServeMode,
  externalPort: number,
  dnsName: string,
): string {
  // Raw TCP has no web scheme and no default port — always show host:port.
  if (mode === 'tcp') return `tcp://${dnsName}:${externalPort}`
  const scheme = serveUsesTailnetTls(mode) ? 'https' : 'http'
  const defaultPort = scheme === 'https' ? 443 : 80
  const suffix = externalPort === defaultPort ? '' : `:${externalPort}`
  return `${scheme}://${dnsName}${suffix}`
}

/** The port to record on a url-v0 export (null when it's the scheme's default). */
export function exportPort(
  mode: ServeMode,
  externalPort: number,
): number | null {
  // No default-port elision for TCP — the port is always meaningful.
  if (mode === 'tcp') return externalPort
  const defaultPort = serveUsesTailnetTls(mode) ? 443 : 80
  return externalPort === defaultPort ? null : externalPort
}

/** `tailscale --socket=<SOCKET> <args>`, as an exec command. */
export const tailscale = (...args: string[]): [string, ...string[]] => [
  'tailscale',
  `--socket=${SOCKET}`,
  ...args,
]

/** The parts of `tailscale status --json` the actions read. */
export type NodeStatus = {
  BackendState?: string
  HaveNodeKey?: boolean
  AuthURL?: string
  TailscaleIPs?: string[] | null
  Self?: { HostName?: string; DNSName?: string } | null
  CurrentTailnet?: { Name?: string } | null
  Health?: string[] | null
}

/**
 * Run `fn` against the running tailscaled, from a temporary subcontainer that
 * shares the volume holding its control socket.
 */
export const withTailscaleCli = <R>(
  effects: T.Effects,
  fn: (cli: {
    /** Rejects failed or timed-out commands. */
    exec: (
      command: string[],
      options?: { timeout?: number },
    ) => Promise<{ stdout: string; stderr: string }>
    writeFile: (path: string, data: string) => Promise<void>
    status: () => Promise<NodeStatus>
  }) => Promise<R>,
) =>
  sdk.SubContainer.withTemp(
    effects,
    { imageId: 'tailscale' },
    sdk.Mounts.of().mountVolume({
      volumeId: 'main',
      subpath: null,
      mountpoint: STATE_DIR,
      readonly: false,
    }),
    'tailscale-cli',
    async (sub) => {
      const exec = async (
        command: string[],
        options?: { timeout?: number },
      ) => {
        const res = await sub.execFail(command, options)
        return { stdout: String(res.stdout), stderr: String(res.stderr) }
      }
      return fn({
        exec,
        writeFile: (path, data) => sub.writeFile(path, data, { mode: 0o600 }),
        status: async () => {
          const res = await exec(
            tailscale('status', '--json', '--peers=false'),
            {
              timeout: 10_000,
            },
          )
          return JSON.parse(res.stdout) as NodeStatus
        },
      })
    },
  )

// `tailscale up` blocks until the node is Running, so it runs in the background
// and is stopped once it has printed a sign-in URL or a device-approval state.
const UP_SCRIPT = `out=$(mktemp); err=$(mktemp)
"$@" >"$out" 2>"$err" &
pid=$!
i=0
while kill -0 "$pid" 2>/dev/null && [ "$i" -lt 30 ] && ! grep -qE '"AuthURL"|"NeedsMachineAuth"' "$out"; do sleep 1; i=$((i+1)); done
kill "$pid" 2>/dev/null
wait "$pid"
cat "$out"; cat "$err" >&2`

/**
 * Sign the node in with `tailscale up --reset`, returning the sign-in URL it
 * printed (if any), the node's state afterwards, and anything it wrote to stderr.
 * Preserves the node's identity while device approval is pending.
 */
export const signIn = (
  effects: T.Effects,
  opts: { authKey?: string; loginServer: string | null },
) =>
  withTailscaleCli(effects, async (cli) => {
    const before = await cli.status()
    if (before.BackendState === 'Running') {
      throw new Error(
        i18n(
          'This node is already signed in. Run Log Out first to sign it in to a different account.',
        ),
      )
    }
    if (before.BackendState === 'NeedsMachineAuth') {
      return { authUrl: null, status: before, error: '' }
    }
    const args = ['up', '--reset', '--json', '--timeout=60s']
    if (opts.loginServer) args.push(`--login-server=${opts.loginServer}`)
    if (opts.authKey) {
      await cli.writeFile('/tmp/auth-key', opts.authKey)
      args.push('--auth-key=file:/tmp/auth-key')
    } else if (before.HaveNodeKey) {
      // An expired or signed-out node still holds a key; without this it is not asked to sign in again.
      args.push('--force-reauth')
    }
    const up = await cli.exec(
      ['sh', '-c', UP_SCRIPT, 'sh', ...tailscale(...args)],
      {
        timeout: 45_000,
      },
    )
    const after = await cli.status()
    const encodedAuthUrl = /"AuthURL":\s*("(?:[^"\\]|\\.)*")/.exec(
      up.stdout,
    )?.[1]
    const authUrl: string | null = encodedAuthUrl
      ? JSON.parse(encodedAuthUrl)
      : after.AuthURL || null
    return {
      authUrl,
      status: after,
      error: up.stderr.trim(),
    }
  })

const statusField = (name: string, value: string | null | undefined) => ({
  type: 'single' as const,
  name,
  description: null,
  value: value || i18n('None'),
  copyable: !!value,
  qr: false,
  masked: false,
  launchable: false,
})

/** The node's state, names, and addresses, as an action result group. */
export const statusGroup = (status: NodeStatus) => ({
  type: 'group' as const,
  value: [
    statusField(i18n('State'), status.BackendState),
    statusField(i18n('Tailnet'), status.CurrentTailnet?.Name),
    statusField(i18n('Device Name'), status.Self?.HostName),
    statusField(
      i18n('MagicDNS Name'),
      status.Self?.DNSName?.replace(/\.+$/, ''),
    ),
    statusField(i18n('Tailscale IPs'), status.TailscaleIPs?.join(', ')),
  ],
})

/** What a Sign In action shows for the outcome of `signIn`. */
export const signInResult = ({
  authUrl,
  status,
  error,
}: Awaited<ReturnType<typeof signIn>>) => {
  if (status.BackendState === 'Running') {
    return {
      version: '1' as const,
      title: i18n('Signed In'),
      message: i18n('This node is signed in to your tailnet.'),
      result: statusGroup(status),
    }
  }
  if (status.BackendState === 'NeedsMachineAuth') {
    return {
      version: '1' as const,
      title: i18n('Waiting for Approval'),
      message: i18n(
        'This node is signed in but needs approval before it joins your tailnet. Approve it in your tailnet’s admin console (Machines), then run Node Status to confirm.',
      ),
      result: null,
    }
  }
  if (authUrl) {
    return {
      version: '1' as const,
      title: i18n('Sign In to Tailscale'),
      message: i18n(
        'Open this link, or scan it from your phone, and sign in to your Tailscale account. The node joins your tailnet once you approve it; run Node Status to confirm.',
      ),
      result: {
        type: 'single' as const,
        value: authUrl,
        copyable: true,
        qr: true,
        masked: false,
        launchable: true,
      },
    }
  }
  throw new Error(
    i18n('Tailscale did not sign in: ${error}', {
      error: error || status.BackendState || i18n('no response'),
    }),
  )
}

/** The optional control-server field both Sign In actions take. */
export const loginServerField = () =>
  sdk.Value.text({
    name: i18n('Login Server'),
    description: i18n(
      'Leave blank to sign in to Tailscale. To use a self-hosted control server such as Headscale, enter its URL.',
    ),
    required: false,
    default: null,
    placeholder: 'https://headscale.example.com',
    patterns: [
      {
        regex: '^https?://[^\\s]+$',
        description: i18n('Must be an http:// or https:// URL'),
      },
    ],
  })
