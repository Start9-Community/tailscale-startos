# Updating the upstream version

This package wraps the official Tailscale client, distributed as the
`ghcr.io/tailscale/tailscale` container image. "Upstream" here means that image
and the [tailscale/tailscale](https://github.com/tailscale/tailscale) source it
is built from.

## Determining the upstream version

Fetch the latest stable Tailscale release tag:

```sh
gh release view -R tailscale/tailscale --json tagName -q .tagName
```

The current pin lives in [`Dockerfile`](./Dockerfile) at
`FROM ghcr.io/tailscale/tailscale:<version>`. Confirm the chosen tag publishes
both `linux/amd64` and `linux/arm64` images (there is no `riscv64` image, which
is why this package drops that arch).

## Applying the bump

1. Bump the tag in `Dockerfile`'s `FROM ghcr.io/tailscale/tailscale:<version>`
   line (keep the leading `v`, e.g. `v1.96.5`).
2. Update the upstream portion of `version` in `startos/versions/current.ts` to
   match (drop the leading `v`), resetting the downstream revision to `0` — e.g.
   `1.96.5:0` → `1.98.0:0` — and refresh its `releaseNotes`. Edit `current.ts` in
   place; the filename stays `current.ts`. Spin off a separate version file only
   when the bump carries a migration. See
   [Versions](https://docs.start9.com/packaging/versions.html) for that rule.
