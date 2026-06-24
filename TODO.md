# TODO

## Verified

- **On this dev box (not signed in):** build → install → start; `tailscaled`
  (userspace-networking) + `web` (port 8240) daemons and the `write-status` oneshot
  all launch; health check reports "waiting for login"; `socat` present; node
  registers its hostname as `startos` (`tailscale status` → `Self.HostName: startos`),
  so exported URLs won't be a random identifier; the `add-serve-from-url` action and
  its input form render correctly.
- **Signed-in flow (serve apply, per-serve `socat` forwarder, `url-v0` export of the
  served URL, reachability from a tailnet device):** previously confirmed end-to-end
  on a live host. Re-confirming it requires signing the node in to a real Tailscale
  account, which the automated pass can't do.

## Resolved

1. **url-v0 export now repopulates after sign-in / restart.** Status capture was moved
   into a standalone `write-status` oneshot that runs even with no serves configured
   (it waits for `Running`, then writes `ts-status.json` in place). The host-side
   `setupExportedUrls` reads that file reactively via the SDK's `FileHelper` watch, so
   the MagicDNS name surfaces without needing a serve add/remove to trigger it. (The
   in-place `>` write is deliberate — an atomic tmp+mv would swap the inode the watch
   is bound to and the update would be missed.)
2. **Device name is no longer the random node identifier.** `tailscaled` now adopts the
   hostname `startos` before it registers, so the node and its published URLs read
   `startos.<tailnet>.ts.net`. A rename in the Tailscale console still takes precedence.

## Possible future enhancements (need a signed-in node to build + verify)

- **Surface serve-apply failures.** A failing `tailscale serve` (e.g. HTTPS Certificates
  not enabled for the tailnet) is currently only visible in the logs and the README's
  Limitations. A standalone health check that reports "serve configured but not active"
  would be friendlier, but should be authored and tested against a signed-in node.
- **Popup-proof sign-in helper.** `tailscale web`'s "Log In" opens the auth URL in a
  popup; the instructions now tell users to allow pop-ups. A copyable login-link/QR
  action is an alternative, but likewise needs a signed-in node to exercise.
