<p align="center">
  <img src="icon.svg" alt="Tailscale Logo" width="21%">
</p>

# Tailscale on StartOS

> Upstream docs: <https://tailscale.com/kb>
>
> This README documents only how the StartOS package differs from upstream Tailscale. Anything not mentioned here behaves as upstream Tailscale does.

[Tailscale](https://tailscale.com/) is a mesh VPN built on WireGuard. This package runs a single persistent Tailscale node on your StartOS server and uses [Tailscale Serve](https://tailscale.com/kb/1242/tailscale-serve) (and optionally [Funnel](https://tailscale.com/kb/1223/funnel)) to expose selected StartOS service interfaces through it — sign the node in once, then expose other installed services from their own URL lists.

- Upstream source: [tailscale/tailscale](https://github.com/tailscale/tailscale)
- Packaging repo: [Start9-Community/tailscale-startos](https://github.com/Start9-Community/tailscale-startos)

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [Daemons](#daemons)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Configuration Management](#configuration-management)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Actions and the URL Plugin](#actions-and-the-url-plugin)
- [Serve Modes](#serve-modes)
- [Backups and Restore](#backups-and-restore)
- [Health Checks](#health-checks)
- [Dependencies](#dependencies)
- [Limitations and Differences](#limitations-and-differences)
- [What Is Unchanged from Upstream](#what-is-unchanged-from-upstream)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)
- [Branding and Trademark](#branding-and-trademark)

## Image and Container Runtime

The container is the official `ghcr.io/tailscale/tailscale` image (see [Dockerfile](./Dockerfile) for the pinned tag) with one addition: `socat`, used for the per-serve localhost forwarders. There is **no custom entrypoint and no helper binary** — everything is orchestrated from `startos/main.ts` using the SDK's daemons. `tailscaled` runs in userspace-networking mode (no TUN device or `NET_ADMIN` required).

Built for `x86_64` and `aarch64`. There is no `riscv64` build — upstream publishes no `riscv64` image.

## Volume and Data Layout

A single `main` volume is mounted at `/var/lib/tailscale` and holds all persistent state:

| Path | Contents |
| --- | --- |
| `tailscaled.state` | Tailscale node identity and keys (preserved across restarts, updates, and restores) |
| `tailscaled.sock` | The tailscaled control socket. It lives on the volume so the daemon, the admin UI, and the apply oneshot can all reach it. |
| `serve-routes.json` | The saved set of serves (`FileHelper`). Written by the actions, read reactively by `main`. |
| `ts-status.json` | `tailscale status --json`, written by the `write-status` oneshot once the node is up, so the host side can read the node's MagicDNS name for the URL exports. |

Because identity lives in `tailscaled.state` on this volume, normal updates and restores keep the node signed in.

## Daemons

`main.ts` returns a fixed core plus a variable set built from the saved serves (adding/removing a serve re-runs `main` and rebuilds this set):

- **`tailscaled`** — the node, in userspace-networking mode.
- **`web`** — `tailscale web`, the upstream admin UI, exported as the package's interface (see below).
- **`fwd-<id>`** — one `socat` forwarder per serve, bridging `127.0.0.1:<localPort>` → the target service's container IP. Tailscale Serve only proxies to localhost, so each serve needs one.
- **`write-status` oneshot** — waits for the node to reach `Running`, then records `tailscale status` to the volume so the host can read the MagicDNS name for the URL exports. Runs even with no serves configured.
- **`serve-reset` + `apply-<id>` oneshots** — once a serve exists, clear stale `tailscale serve` / `funnel` config and re-apply it for each serve.

## Installation and First-Run Flow

1. Install and start the service.
2. Open the **Tailscale Admin** interface (the `tailscale web` UI) and sign the node in to your tailnet. Status, device name, and settings are all managed there.
3. To use HTTPS or Funnel serves, enable **HTTPS Certificates** for your tailnet in the Tailscale admin console (DNS → HTTPS).
4. Expose other services from their own URL lists — see below.

## Configuration Management

| StartOS-Managed | Upstream-Managed |
| --- | --- |
| The set of serves (mode + published port per serve), chosen on the URL table; the node's default device name (`startos`, set before first registration so published URLs aren't a random identifier) | Node identity, MagicDNS, ACLs, device renaming, HTTPS-certificate and Funnel enablement, and every other node setting — all in the `tailscale web` UI and the Tailscale admin console |

There is no StartOS config form for this package. The only StartOS-side configuration is the set of serves, persisted to `serve-routes.json` as you add and remove them from service URL lists. The package sets the node's default device name to `startos` (the user can rename it in the Tailscale console, which takes precedence); everything else about the node is configured in Tailscale's own surfaces.

## Network Access and Interfaces

The package exports exactly one StartOS interface: **Tailscale Admin** (`web`, the upstream `tailscale web` UI), which is how you sign the node in and manage it. The services you serve are reached over your tailnet by this node's MagicDNS name (or the Funnel public address), and are surfaced back into StartOS through the URL plugin — they are not separate StartOS interfaces.

## Actions and the URL Plugin

The package registers the StartOS `url-v0` plugin and has **no directly-runnable actions** — sign-in and node management live in the `tailscale web` UI, and serves are managed from the URL table. Two hidden actions back the table:

| Action (hidden) | Trigger | Effect |
| --- | --- | --- |
| **Serve On Tailscale** (`add-serve-from-url`) | The **Serve On Tailscale** button on another service's URL list | Adds a serve for that interface (pick a [mode](#serve-modes) and published port). |
| **Stop Tailscale Serve** (`remove-serve-from-url`) | The remove control on an exported row | Removes that serve. |

Each active serve is exported back onto its own service's URL list, pointing at this node's MagicDNS name (marked public when it is a Funnel serve). Only interfaces that advertise HTTP(S) can be served.

## Serve Modes

| Mode | Where it's reachable | Notes |
| --- | --- | --- |
| **HTTPS** | Your tailnet, `https://<magicdns>[:port]` | Tailscale-managed TLS cert; requires HTTPS Certificates enabled on the tailnet. |
| **HTTP** | Your tailnet, no TLS | For tailnets without HTTPS certificates enabled. |
| **Funnel** | The **public internet** | Reachable by anyone. Restricted to ports 443, 8443, 10000; requires Funnel enabled for your tailnet. |

## Backups and Restore

The `main` volume is backed up in full, so backups include the node identity and the saved serves. Restoring keeps the node signed in and re-applies its serves.

## Health Checks

`tailscaled`'s readiness check queries `tailscale status --json`: **running** when `BackendState` is `Running`, **waiting for login** when it needs authentication, **starting** while it initializes, **failure** if the daemon is unreachable. The admin UI and each forwarder report reachability via a port-listening check.

## Dependencies

None.

## Limitations and Differences

1. The package creates a Tailscale node **for itself** and serves selected interfaces from it. It does not turn the whole StartOS host into a subnet router, nor publish every installed service automatically.
2. Only interfaces that advertise HTTP(S) can be served (Serve fronts HTTP/HTTPS endpoints). Raw TCP / TLS-terminated-TCP serves are not offered.
3. HTTPS and Funnel serves require the corresponding feature (HTTPS Certificates, Funnel) enabled for your tailnet in the Tailscale admin console; otherwise the serve fails to come up and the error appears in this package's logs.
4. Adding or removing a serve briefly restarts the node (it reconnects automatically from saved state).

## What Is Unchanged from Upstream

- `tailscaled`, the `tailscale` CLI, and the `tailscale web` admin UI behave exactly as upstream.
- Node identity, MagicDNS, ACLs, and admin-console configuration are managed in your Tailscale account as usual.

## Quick Reference for AI Consumers

```yaml
package_id: tailscale
image_base: ghcr.io/tailscale/tailscale # see Dockerfile for pinned tag; + socat
architectures: [x86_64, aarch64]
volumes:
  main: /var/lib/tailscale # node identity, control socket, serve-routes.json, ts-status.json
exported_interfaces:
  web: tailscale web admin UI (port 8240) # sign-in + node management surface
served_targets_reach: tailnet MagicDNS name (or Funnel public address), surfaced via url-v0
dependencies: none
plugins: [url-v0]
auth: interactive sign-in via the tailscale web UI (no auth key, no env vars)
serve_modes: [https, http, funnel] # funnel = public internet, ports 443/8443/10000
actions:
  hidden: [add-serve-from-url, remove-serve-from-url] # invoked from the url-v0 table only
runtime:
  daemons: [tailscaled, web, 'fwd-<id> (socat, one per serve)']
  oneshots: ['write-status (waits for Running, captures MagicDNS name)', 'serve-reset (one, only when serves exist)', 'apply-<id> (one per serve)']
```

## Branding and Trademark

This package is distributed under Tailscale's BSD-3-Clause license (see [LICENSE](./LICENSE)), matching the manifest's `license` field. `icon.svg` is derived from Tailscale's published favicon and is used only to identify the upstream project. Tailscale is a registered trademark of Tailscale Inc.; no affiliation or endorsement is implied.
