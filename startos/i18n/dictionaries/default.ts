export const DEFAULT_LANG = 'en_US'

const dict = {
  // main.ts — daemons + health checks
  'Tailscale Daemon': 0,
  'Tailscaled is running': 1,
  'Tailscaled is not ready': 2,
  'Tailscale is waiting for login': 3,
  'Tailscaled is starting': 4,
  'Tailscale Admin Interface': 5,
  'Admin interface is reachable': 6,
  'Admin interface is not reachable': 7,
  'Forwarder is listening': 8,
  'Forwarder is not listening': 9,
  // interfaces.ts
  'Tailscale Admin': 10,
  'Tailscale’s own web interface — sign this node in and manage it here.': 11,
  // actions/addExposureFromUrl.ts — metadata + input spec
  'Serve On Tailscale': 12,
  'Serve this interface through this Tailscale node. Choose HTTPS or HTTP on your private tailnet, or Funnel to publish it on the public internet.': 13,
  'Serve Mode': 14,
  'HTTPS and HTTP keep this service on your private tailnet. Funnel publishes the same HTTPS endpoint on the PUBLIC INTERNET, reachable by anyone — only use it if that is what you want. Funnel is restricted to ports 443, 8443, and 10000.': 15,
  'HTTPS (tailnet only, Tailscale-managed TLS)': 16,
  'HTTP (tailnet only, no TLS)': 17,
  'Funnel (PUBLIC HTTPS on the open internet)': 18,
  'Published Port': 19,
  'Other Tailscale devices connect to this node on this port.': 20,
  // actions/removeExposureFromUrl.ts — metadata
  'Stop Tailscale Serve': 21,
  'Stop serving this interface through this Tailscale node.': 22,
  // actions/addExposureFromUrl.ts — results + errors
  'That interface does not advertise HTTP, so it cannot be served through Tailscale.': 23,
  'That interface is already served with this mode and port.': 24,
  'Port ${port} is already in use by another Tailscale serve.': 25,
  'Funnel only accepts ports 443, 8443, and 10000. Pick one of those for a Funnel serve.': 26,
  'Tailscale Serve Added': 27,
  'Saved. Funnel publishes this service on the PUBLIC INTERNET once this node is signed in and Funnel is enabled for your tailnet. The address appears in this service’s list shortly.': 28,
  'Saved. The address appears in this service’s list once this node is signed in to your tailnet.': 29,
  // actions/removeExposureFromUrl.ts — results + errors
  'Unsupported Target': 30,
  'This URL entry did not come from a normal package service interface, so it cannot be removed through this action.': 31,
  'That Tailscale serve no longer exists.': 32,
  'Tailscale Serve Removed': 33,
  'This node stops serving that interface over Tailscale within a few seconds.': 34,
  '${title} → ${iface} (${mode}, port ${port})': 35,
} as const

/**
 * Plumbing. DO NOT EDIT.
 */
export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
