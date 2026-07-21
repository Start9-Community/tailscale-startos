# Upstream Tailscale image (tailscaled + the `tailscale`/`tailscale web` CLI),
# plus socat for the per-serve localhost forwarders that Tailscale Serve requires.
FROM ghcr.io/tailscale/tailscale:v1.98.9

RUN apk add --no-cache socat
