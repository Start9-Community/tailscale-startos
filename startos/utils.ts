import { STATUS_FILE_SUBPATH } from './fileModels/status'
import { serveUsesTailnetTls, type ServeMode } from './fileModels/serveConfig'

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
