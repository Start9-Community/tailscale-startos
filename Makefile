# overrides to s9pk.mk must precede the include statement
# Upstream ghcr.io/tailscale/tailscale publishes no riscv64 image, so we can't
# build that arch without compiling Tailscale from source. Drop it.
ARCHES := x86 arm
include s9pk.mk
