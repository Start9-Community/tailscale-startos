export const DEFAULT_LANG = 'en_US'

const dict = {
  // main.ts — daemons + health checks
  'Tailscale Daemon': 0,
  'Tailscaled is running': 1,
  'Tailscaled is not ready': 2,
  'Tailscale is waiting for login': 3,
  'Tailscaled is starting': 4,
  'Forwarder is listening': 8,
  'Forwarder is not listening': 9,
  // actions/addExposureFromUrl.ts — metadata + input spec
  'Serve On Tailscale': 12,
  'Serve this interface through this Tailscale node — HTTPS or HTTP on your private tailnet, raw TCP for non-web services, or Funnel to publish it on the public internet.': 13,
  'Serve Mode': 14,
  '- HTTPS: reachable only from your tailnet, over HTTPS with a certificate Tailscale manages. Needs HTTPS Certificates enabled for your tailnet.\n- HTTP: reachable only from your tailnet, over plain HTTP without TLS.\n- Funnel: published on the public internet over HTTPS, reachable by anyone. Needs HTTPS Certificates and Funnel enabled for your tailnet, and port 443, 8443 or 10000.\n- TCP: reachable only from your tailnet, as raw TCP. For services that are not websites, such as LND or electrs.': 15,
  '- TCP: reachable only from your tailnet, as raw TCP. This interface does not offer HTTP, so TCP is the only mode.': 44,
  'HTTPS (tailnet only, Tailscale-managed TLS)': 16,
  'HTTP (tailnet only, no TLS)': 17,
  'Funnel (PUBLIC HTTPS on the open internet)': 18,
  'Published Port': 19,
  'Other Tailscale devices connect to this node on this port.': 20,
  // actions/removeExposureFromUrl.ts — metadata
  'Stop Tailscale Serve': 21,
  'Stop serving this interface through this Tailscale node.': 22,
  'Devices on your tailnet will no longer be able to reach this interface through this node. A Funnel serve is also taken off the public internet.': 45,
  // actions/addExposureFromUrl.ts — results + errors
  'That interface does not advertise HTTP, so it can only be served over Tailscale in TCP mode.': 23,
  'This interface was already served with this mode and port; its address has been refreshed.': 24,
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
  // actions/addExposureFromUrl.ts — TCP serve mode
  'TCP (tailnet only, raw TCP passthrough)': 36,
  'That interface can no longer be reached, so it cannot be served through Tailscale.': 37,
  // main.ts — serve health check
  'No interfaces are served': 38,
  'Sign this node in to your tailnet to serve interfaces': 39,
  'Could not read the serve configuration from tailscaled': 40,
  'All serves are active': 41,
  'Not active: ${routes}. HTTPS and Funnel serves need HTTPS Certificates enabled for your tailnet in the Tailscale admin console, and Funnel needs Funnel enabled.': 42,
  'Tailscale Serve': 43,
  // actions — sign-in, status, log out
  'Sign In': 46,
  'Get a link to sign this node in to your tailnet from any browser.': 47,
  'Sign In with Auth Key': 48,
  'Sign this node in to your tailnet with an auth key generated in your tailnet’s admin console.': 49,
  'Auth Key': 50,
  'An auth key from your tailnet’s admin console (Settings → Keys), or one your control server issued.': 51,
  'Enter an auth key.': 52,
  'Login Server': 53,
  'Leave blank to sign in to Tailscale. To use a self-hosted control server such as Headscale, enter its URL.': 54,
  'Must be an http:// or https:// URL': 55,
  'Log Out': 56,
  'Sign this node out of your tailnet. Run Sign In afterwards to sign it in again, to the same account or another one.': 57,
  'Signs this node out of your tailnet and restarts Tailscale. Every interface it serves stops being reachable over Tailscale until you sign in again.': 58,
  'Node Status': 59,
  'Show whether this node is signed in, and its tailnet, names, and Tailscale IPs.': 60,
  'Waiting for sign-in. Open this link to finish: ${url}': 61,
  'Sign this node in to your tailnet': 62,
  'This node is already signed in. Run Log Out first to sign it in to a different account.': 63,
  None: 64,
  State: 65,
  Tailnet: 66,
  'Device Name': 67,
  'MagicDNS Name': 68,
  'Tailscale IPs': 69,
  'Signed In': 70,
  'This node is signed in to your tailnet.': 71,
  'Waiting for Approval': 72,
  'This node is signed in but needs approval before it joins your tailnet. Approve it in your tailnet’s admin console (Machines), then run Node Status to confirm.': 73,
  'Sign In to Tailscale': 74,
  'Open this link, or scan it from your phone, and sign in to your Tailscale account. The node joins your tailnet once you approve it; run Node Status to confirm.': 75,
  'Tailscale did not sign in: ${error}': 76,
  'no response': 77,
} as const

/**
 * Plumbing. DO NOT EDIT.
 */
export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
