import { T, utils } from '@start9labs/start-sdk'
import { sdk } from './sdk'
import { STATUS_FILE_SUBPATH } from './fileModels/status'
import { serveUsesTailnetTls, type ServeMode } from './fileModels/serveConfig'

/** Find a filled interface by id across a resolved host's bindings. */
export const findIface = (host: utils.FilledHost | null, interfaceId: string) =>
  (host &&
    Object.values(host.bindings)
      .flatMap((b) => Object.values(b.interfaces))
      .find((i) => i.id === interfaceId)) ||
  undefined

/**
 * The target host for a serve route, over the LXC bridge. Prefers the `hostId`
 * captured on the route (host-based — the normal path). A legacy route saved
 * before the hostId was stored derives it once from the interface; that raw
 * interface read is the only place `getServiceInterface` remains.
 */
export const routeHost = async (
  effects: T.Effects,
  route: { packageId: string; interfaceId: string; hostId?: string },
) => {
  let hostId = route.hostId
  if (!hostId) {
    const iface = await effects.getServiceInterface({
      packageId: route.packageId,
      serviceInterfaceId: route.interfaceId,
    })
    hostId = iface?.addressInfo?.hostId
    if (!hostId) return null
  }
  return sdk.host.get(effects, { hostId, packageId: route.packageId }).once()
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
  return iface
    ? iface.addressInfo.filter({
        kind: 'bridge',
        predicate: (h) => h.metadata.kind === 'ipv4' && h.ssl === ssl,
      }).hostnames[0]
    : undefined
}

// Runtime paths inside the container. The tailscaled socket lives on the `main`
// volume so the daemon, the `tailscale web` UI, and the serve-apply oneshot all
// share it across subcontainers.
export const STATE_DIR = '/var/lib/tailscale'
export const SOCKET = `${STATE_DIR}/tailscaled.sock`
export const STATUS_FILE = `${STATE_DIR}${STATUS_FILE_SUBPATH}`
export const WEB_UI_PORT = 8240

/** Default device name set before tailscaled registers (user-overridable in the Tailscale console). */
export const DEVICE_NAME = 'startos'

export type AddressInfoLike = {
  hostId: string
  internalPort: number
  scheme?: string | null
  sslScheme?: string | null
}

/**
 * How tailscaled should dial the local socat forwarder for this interface.
 * Returns null when the interface advertises no HTTP(S) endpoint (can't be served).
 */
export function targetSchemeFor(
  addressInfo: AddressInfoLike,
): 'http' | 'https+insecure' | null {
  if (addressInfo.scheme?.startsWith('http')) return 'http'
  if (addressInfo.sslScheme?.startsWith('http')) return 'https+insecure'
  return null
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
