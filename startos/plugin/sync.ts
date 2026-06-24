import { sdk } from '../sdk'
import { serveConfig, serveUsesTailnetTls } from '../fileModels/serveConfig'
import { magicDnsName, statusFile } from '../fileModels/status'
import { buildTailnetUrl, exportPort } from '../utils'
import { removeExposureFromUrl } from '../actions/removeExposureFromUrl'

// Mirrors the saved serves into the StartOS url-v0 table: each served interface
// shows up (with a "Stop Tailscale Serve" button) on its own service's URL list.
// Reactive on both the serve set and the node's status, so a URL appears as soon
// as the node has a MagicDNS name. Kept free of any import from `./register` so the
// action modules can call it after writing the config without an import cycle.
export const syncExportedUrls = sdk.plugin.url.setupExportedUrls(
  async ({ effects }) => {
    const routes =
      (await serveConfig.read((c) => c.routes).const(effects)) ?? []
    const dnsName = magicDnsName(await statusFile.read().const(effects))
    if (!dnsName) return

    for (const route of routes) {
      const iface = await sdk.serviceInterface
        .get(effects, { packageId: route.packageId, id: route.interfaceId })
        .once()
      if (!iface?.addressInfo) continue

      await sdk.plugin.url
        .exportUrl(effects, {
          hostnameInfo: {
            packageId: route.packageId,
            hostId: iface.addressInfo.hostId,
            internalPort: iface.addressInfo.internalPort,
            ssl: serveUsesTailnetTls(route.mode),
            public: route.mode === 'funnel',
            hostname: dnsName,
            port: exportPort(route.mode, route.externalPort),
            info: {
              routeId: route.id,
              mode: route.mode,
              url: buildTailnetUrl(route.mode, route.externalPort, dnsName),
            },
          },
          removeAction: removeExposureFromUrl,
          overflowActions: [],
        })
        .catch((e) => console.error('Failed to export Tailscale serve url', e))
    }
  },
)
