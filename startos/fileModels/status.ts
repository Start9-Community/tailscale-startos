import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

// `tailscale status --json`, written to the volume by the serve-apply oneshot once
// the node reaches `Running`. The host-side code (url-v0 export, actions) can't reach
// tailscaled's socket, so this file is how it learns the node's MagicDNS name. We only
// ever READ it here — the in-container oneshot writes it with a shell redirect.
const statusSchema = z
  .object({
    BackendState: z.string().optional(),
    Self: z.object({ DNSName: z.string().optional() }).passthrough().optional(),
  })
  .passthrough()
  .catch({})

export type TailscaleStatus = z.infer<typeof statusSchema>

export const STATUS_FILE_SUBPATH = '/ts-status.json'

export const statusFile = FileHelper.raw(
  { base: sdk.volumes.main, subpath: STATUS_FILE_SUBPATH },
  (data: TailscaleStatus) => `${JSON.stringify(data, null, 2)}\n`,
  (raw) => JSON.parse(raw),
  (data) => statusSchema.parse(data),
)

/** The node's MagicDNS name (e.g. `my-host.tailnet.ts.net`), trailing dot stripped. */
export function magicDnsName(status: TailscaleStatus | null): string | null {
  const name = status?.Self?.DNSName?.trim().replace(/\.+$/, '')
  return name && name.length > 0 ? name : null
}
