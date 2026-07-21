import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

// One Tailscale serve, keyed by its target StartOS interface + mode + external port.
// Only the stable identity, display labels, and the allocated local forwarder port
// are persisted; the target's container IP / internal port / scheme are resolved
// fresh at runtime (they can change when the target service restarts).
const routeSchema = z.object({
  id: z.string(),
  packageId: z.string(),
  interfaceId: z.string(),
  // The interface's host id, captured at add-time from the url-v0 metadata so
  // the runtime resolves the target via `sdk.host.get` with no fresh interface
  // read. Optional: routes saved before it was stored fall back to deriving it.
  hostId: z.string().optional(),
  packageTitle: z.string(),
  interfaceName: z.string(),
  // https/http/tcp serve on the private tailnet; funnel publishes on the public internet
  mode: z.enum(['https', 'http', 'funnel', 'tcp']),
  externalPort: z.number().int().min(1).max(65535),
  // 127.0.0.1 port the in-container socat forwarder listens on (tailscale serve
  // only proxies to localhost, so every route needs a local forwarder)
  localPort: z.number().int().min(1024).max(65535),
})

export const serveConfigSchema = z
  .object({
    version: z.literal(1).catch(1),
    routes: z.array(routeSchema).catch([]),
  })
  .catch({ version: 1, routes: [] })

export type ServeMode = z.infer<typeof routeSchema>['mode']
export type ServeRoute = z.infer<typeof routeSchema>
export type ServeConfig = z.infer<typeof serveConfigSchema>

export const serveConfig = FileHelper.raw(
  { base: sdk.volumes.main, subpath: '/serve-routes.json' },
  (data: ServeConfig) => `${JSON.stringify(data, null, 2)}\n`,
  (raw) => JSON.parse(raw),
  (data) => serveConfigSchema.parse(data),
)

/** Tailscale only accepts these external ports for Funnel. */
export const FUNNEL_ALLOWED_PORTS = [443, 8443, 10000] as const

export function isFunnelMode(mode: ServeMode): boolean {
  return mode === 'funnel'
}

export function serveUsesTailnetTls(mode: ServeMode): boolean {
  return mode === 'https' || mode === 'funnel'
}

export function serveModeLabel(mode: ServeMode): string {
  switch (mode) {
    case 'https':
      return 'HTTPS'
    case 'http':
      return 'HTTP'
    case 'funnel':
      return 'Funnel'
    case 'tcp':
      return 'TCP'
  }
}

export function isFunnelPort(port: number): boolean {
  return FUNNEL_ALLOWED_PORTS.includes(port as 443 | 8443 | 10000)
}

export function routeId(
  packageId: string,
  interfaceId: string,
  mode: ServeMode,
  externalPort: number,
): string {
  return `${packageId}-${interfaceId}-${mode}-${externalPort}`
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
}

const LOCAL_PORT_START = 20_000
const LOCAL_PORT_END = 39_999

export function allocateLocalPort(existing: ServeRoute[]): number {
  const used = new Set(existing.map((route) => route.localPort))
  for (let port = LOCAL_PORT_START; port <= LOCAL_PORT_END; port += 1) {
    if (!used.has(port)) return port
  }
  throw new Error('No free local ports remain for new Tailscale serves.')
}
