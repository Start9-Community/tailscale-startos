<p align="center">
  <img src="icon.png" alt="Tailscale Logo" width="21%">
</p>

# Tailscale on StartOS

> Everything not listed in this document should behave the same as upstream
> Tailscale. If a feature, setting, or behavior is not mentioned here, the
> upstream documentation is accurate and fully applicable — see the
> Documentation section of `instructions.md` for links.

[Tailscale](https://github.com/tailscale/tailscale) is a WireGuard-based mesh VPN: your devices join a private network and reach each other wherever they are. This package joins your server to your tailnet and — through a StartOS plugin — lets you publish any other service's interface onto it from that service's own URL list.

- **Upstream repo:** <https://github.com/tailscale/tailscale>
- **Wrapper repo:** <https://github.com/Start9-Community/tailscale-startos>

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [File Models](#file-models)
- [Dependencies](#dependencies)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Actions](#actions)
- [Tasks](#tasks)
- [Health Checks](#health-checks)
- [Backups and Restore](#backups-and-restore)
- [Limitations and Differences](#limitations-and-differences)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

One image, built here, running a **variable number of daemons**.

| Property      | Value                                     |
| ------------- | ----------------------------------------- |
| Image         | Built from this repo's `Dockerfile`       |
| Architectures | x86_64, aarch64                           |
| Command       | `tailscaled` in userspace networking mode |

| Subcontainer    | Purpose                                           |
| --------------- | ------------------------------------------------- |
| `tailscale-sub` | Every daemon and oneshot — the one to `attach` to |

The fixed daemons are `tailscaled` and Tailscale's own web client. **Beyond those, one forwarder daemon and one apply oneshot are added per served route**, so the daemon set is rebuilt whenever the set of served interfaces changes.

**`tailscaled` runs in userspace networking mode**, without a TUN device — that is what lets it work inside a container without host network privileges. The trade is that it is a client and a serving node, not a subnet router or exit node.

**The device name is set before `tailscaled` registers.** Left alone it would adopt the container's random hostname and the node — and every URL published from it — would appear in your tailnet under a meaningless name. Setting it only changes the _default_, so renaming the device in Tailscale's console still wins.

## Volume and Data Layout

One volume.

| Volume | Mount Point          | Purpose                        |
| ------ | -------------------- | ------------------------------ |
| `main` | `/var/lib/tailscale` | Node identity and serve config |

| Path               | Written by  | Holds                                   |
| ------------------ | ----------- | --------------------------------------- |
| `tailscaled.state` | tailscaled  | The node's identity on your tailnet     |
| `tailscaled.sock`  | tailscaled  | The control socket                      |
| `ts-status.json`   | A oneshot   | The node's status, for the host side    |
| _serve config_     | The actions | Which interfaces are published, and how |

**The control socket lives on the volume deliberately.** The daemon, the web client, and the serve-apply steps all run as separate processes and all need to talk to `tailscaled` — putting the socket on shared storage is what lets them.

**`tailscaled.state` is the node's identity.** Restoring it elsewhere reproduces the same tailnet device.

## File Models

Two models, and one of them exists to cross a boundary.

| File             | Format | Modelled               | Written by                      |
| ---------------- | ------ | ---------------------- | ------------------------------- |
| _serve config_   | JSON   | Yes — `FileHelper.raw` | The actions                     |
| `ts-status.json` | JSON   | Yes — read only        | A oneshot, inside the container |

The serve config is the list of published routes: which package and interface, which mode, which ports. It is read reactively, which is what rebuilds the forwarders and re-applies the serves when a route is added or removed.

**The status file exists because the package's own code cannot reach `tailscaled`.** The socket is inside the container; the code that exports URLs and drives the actions runs outside it. So a oneshot waits for the node to reach a running state and writes `tailscale status` to the volume, where the host side reads the MagicDNS name from it.

Two details of that are load-bearing:

- **It is written even with no routes configured**, so the name is available immediately after sign-in rather than only after the first serve is added.
- **It is written in place**, not through a temporary file and a rename. The watch is bound to that file's inode, and an atomic replace would swap the inode and the update would be missed.

## Dependencies

None — and it is the other direction that matters. **Every other service is a potential target**, reached over the internal bridge when a route is applied.

Tailscale needs internet to reach its coordination servers and to build connections to your other devices.

## Network Access and Interfaces

One StartOS interface, and it is not where the interesting traffic goes.

| Interface | Id    | Type | Port | Description                |
| --------- | ----- | ---- | ---- | -------------------------- |
| Admin     | `web` | ui   | 8240 | Tailscale's own web client |

**This interface is the sign-in and management surface**, not the way served services are reached. Those are reached **over the tailnet**, at the node's MagicDNS name, and never through a StartOS address.

**Serving works by forwarding, because Tailscale only serves what is on localhost.** For each route the package runs a small forwarder from a local port to the target service's bridge address, and points `tailscale serve` at that local port. It is why a route needs a daemon of its own.

Four modes are supported, and one of them leaves your tailnet:

| Mode     | Reachable by                                 |
| -------- | -------------------------------------------- |
| `https`  | Your tailnet, with Tailscale's TLS           |
| `http`   | Your tailnet, plaintext                      |
| `tcp`    | Your tailnet, raw TCP — for non-web services |
| `funnel` | **The public internet**                      |

**Funnel publishes a service to anyone**, not just your devices. It is a deliberate choice offered in the same form as the others, and it is limited to the ports Tailscale allows for it.

## Installation and First-Run Flow

Install registers the plugin and nothing else. There is no task and no credential.

**Sign-in happens in Tailscale's own web interface**, not through a StartOS action: open the admin interface, follow the link to authenticate the node against your tailnet, and it joins.

Once the node is running, the package records its status and its MagicDNS name becomes available. From then on, **every other service's URL list gains a "Serve On Tailscale" button** — that is the plugin at work, and it is how routes are added.

Adding a route restarts this service, since the forwarder set is rebuilt.

## Actions

Two actions, **both hidden**.

They do not appear in this service's Actions tab, because neither is meant to be run from here: they are invoked from the StartOS URL table of whichever service you are publishing.

### Serve On Tailscale

Adds a route: publishes one interface of one service onto the tailnet, in the chosen mode and on the chosen port.

- **Invoked from the target service's URL list**, via the button the plugin adds.
- **What it changes:** the serve config, and through it this service's forwarder set.
- **Cost:** Tailscale restarts and re-applies every route.
- **Funnel mode publishes to the public internet**, and is restricted to the ports Tailscale permits.

### Stop Tailscale Serve

Removes a route.

- **Invoked from the exported row** in the same URL table.
- **What it changes:** the serve config; the forwarder and its serve rule go away on the restart.

Both are hidden rather than absent, so the platform can drive them while a user never has to find them here.

## Tasks

None. This package raises no tasks, so the service is never held on a prompt and its ordinary controls are always available.

## Health Checks

Two named checks, plus one hidden check per route.

| Check         | Displayed as                | Method                              |
| ------------- | --------------------------- | ----------------------------------- |
| `tailscaled`  | "Tailscale Daemon"          | The daemon's own reported state     |
| `web`         | "Tailscale Admin Interface" | Port 8240 is listening              |
| `fwd-<route>` | — internal                  | That route's forwarder is listening |

**The daemon check reports "waiting for login" as a success, not a failure**, and that is right: a node that has never been signed in is working correctly, it just has not been told who it belongs to yet. Only an unreachable or unparseable daemon fails.

None of the checks says whether a served service is actually reachable from another device. That depends on the target service being up and on Tailscale's own connectivity, and it is visible from the device you are connecting with.

## Backups and Restore

The `main` volume is copied wholesale — `sdk.Backups.ofVolumes('main')`. That is the node's identity, the serve configuration, and the recorded status.

**The backup is the tailnet identity.** Restoring it reproduces the same device, with the same name and the same authorization — which is what makes a restore seamless and what makes the backup sensitive.

**Do not run a restored copy alongside the original.** Two nodes presenting one identity to a tailnet is not a supported configuration.

A restored instance comes back signed in, with its routes intact, and re-resolves each target's bridge address on the new server.

## Limitations and Differences

1. **Userspace networking only.** No TUN device, so this node is not a subnet router or an exit node.
2. **Served services are reached over the tailnet**, never through a StartOS address.
3. **Funnel mode publishes to the public internet**, on Tailscale's permitted ports only.
4. **Every route costs a forwarder daemon**, and adding or removing one restarts the service and re-applies all routes.
5. **A route's target must expose an HTTP or HTTPS endpoint** for the web modes; anything else has to use raw TCP.
6. **Sign-in is out of band**, in Tailscale's own interface — there is no StartOS action for it.
7. **The backup reproduces the device identity**, so never restore two copies.
8. **Tailscale's coordination servers are a third party** your devices depend on to find each other.

---

## Quick Reference for AI Consumers

```yaml
package_id: tailscale
image: built from ./Dockerfile
architectures:
  - x86_64
  - aarch64
subcontainers:
  - tailscale-sub # all daemons and oneshots share it, and the tailscaled socket
volumes:
  main: /var/lib/tailscale # tailscaled.state + .sock, ts-status.json, serve config
file_models:
  - serve config # the published routes; read reactively, rebuilds the daemon set
  - ts-status.json # written in-container, read on the host for the MagicDNS name
startos_managed_env_vars: []
dependencies: [] # but every other package is a potential serve target
interfaces:
  web: { type: ui, port: 8240 } # Tailscale's own web client — sign-in and management
actions:
  - add-serve-from-url # hidden; invoked from another service's URL table
  - remove-serve-from-url # hidden; invoked from the exported row
tasks: []
health_checks:
  - tailscaled # "waiting for login" reports success, not failure
  - web
  - fwd-<route> # internal (display: null)
```
