# Tailscale

## Documentation

- [Tailscale quickstart](https://tailscale.com/kb/1346/start) — what a tailnet is and how to add devices.
- [Tailscale Serve](https://tailscale.com/kb/1242/tailscale-serve) and [Funnel](https://tailscale.com/kb/1223/funnel) — how this node publishes services.
- [Enabling HTTPS](https://tailscale.com/kb/1153/enabling-https) — required for HTTPS and Funnel serves.

## What you get on StartOS

- A signed-in Tailscale node, reachable from your other Tailscale devices by its MagicDNS name.
- Tailscale's own web interface, for signing in and managing the node.
- A **Serve On Tailscale** button on every other installed service's interface list, so you can expose those services through this node — privately over HTTPS, HTTP, or raw TCP, or publicly via Funnel.

## Notes

- **You can serve the StartOS admin UI itself** over Tailscale — click **Serve On Tailscale** on the StartOS UI's interface list.

## Getting set up

1. Start the service and open its **Tailscale Admin** interface (Tailscale's web UI).
2. Sign the node in to your tailnet there, following Tailscale's prompts. Tailscale opens its sign-in page in a new browser tab — if nothing happens when you click **Log In**, allow pop-ups for this page (or open the login link it shows). The same screen displays the node's status and MagicDNS name once it connects.
3. The node joins your tailnet as **startos** by default. Rename it from the [Tailscale admin console](https://login.tailscale.com/admin/machines) if you want a different MagicDNS name for the addresses you publish.
4. If you plan to use HTTPS or Funnel serves, enable **HTTPS Certificates** for your tailnet in the [Tailscale admin console](https://login.tailscale.com/admin/dns) (DNS → HTTPS). Without it, an HTTPS or Funnel serve will not come up.

## Using Tailscale

### Exposing another service

1. Open the service you want to reach over Tailscale and find its **interface / URL list**.
2. Click **Serve On Tailscale**.
3. Choose a mode:
   - **HTTPS** or **HTTP** — keeps the service on your private tailnet.
   - **TCP** — raw TCP passthrough on your private tailnet, for non-web services like LND or electrs. Reach it from your other Tailscale devices at `name:port`. Non-web services offer only this mode.
   - **Funnel** — publishes it on the **public internet**, reachable by anyone. Only use this if that's what you intend. Funnel allows only ports 443, 8443, and 10000.
4. Confirm the published port and save. The address appears in that service's URL list once the node is connected. To stop exposing it, use **Stop Tailscale Serve** on that row.

> Adding or removing a serve briefly restarts this node; it reconnects on its own.
