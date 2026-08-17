# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`,
which provides the packaging guide and agent context one level up. If you're reading this in a
bare clone with no workspace, the full guide is at <https://docs.start9.com/packaging>.

Work this package's `TODO.md` from top to bottom. Keep `README.md` (technical reference for an AI support or administering agent) and `instructions.md` (end-user docs) in sync with your changes.

## This repo

- **`ts-status.json` must be written in place (`>`), never tmp+mv.** The host-side `FileHelper` watch is bound to that inode; an atomic replace swaps it and every subsequent update is missed. The file exists at all because the package's own code cannot reach `tailscaled`'s socket — the socket is in the container, the exporting code is not.
- **The status oneshot runs even with no routes configured.** That is what makes the MagicDNS name available right after sign-in instead of only after the first serve.
- **`tailscale serve` only proxies to localhost**, which is why each route gets a `socat` forwarder daemon. Don't try to point serve at a bridge address directly.
- **Daemon ids are widened to `string` and cast `as never`** so a variable number of forwarder/apply daemons can be added in a loop; `requires` is matched against ids at runtime.
- **Set the hostname before `tailscaled` registers.** Otherwise it adopts the random subcontainer hostname and the node — plus every exported serve URL — appears as `<random>.<tailnet>.ts.net`. It only sets the default, so a console rename still wins.
- **Both actions are `visibility: 'hidden'` on purpose.** They are driven from the `url-v0` table on other services, not from this package's Actions tab.
- **`--tun=userspace-networking` is required** in a container with no host network privileges; it also means this node cannot be a subnet router or exit node.
- **Funnel is public-internet exposure**, restricted to Tailscale's allowed ports — keep it clearly distinguished from the tailnet-only modes in any UI text.
