import { sdk } from '../sdk'
import { serveConfig, serveUsesTailnetTls } from '../fileModels/serveConfig'
import { magicDnsName, statusFile } from '../fileModels/status'
import { buildTailnetUrl, exportPort, findIface, routeHostId } from '../utils'
import { removeExposureFromUrl } from '../actions/removeExposureFromUrl'

// Mirrors the saved serves into the StartOS url-v0 table: each served interface
// shows up (with a "Stop Tailscale Serve" button) on its own service's URL list.
// Reactive on the serve set, the node's status, and each target's host, so a URL
// appears as soon as the node has a MagicDNS name and comes back when a target
// is reinstalled. Kept free of any import from `./register` so the action modules
// can call it after writing the config without an import cycle.
export const syncExportedUrls = sdk.plugin.url.setupExportedUrls(
  async ({ effects }) => {
    const routes =
      (await serveConfig.read((c) => c.routes).const(effects)) ?? []
    const dnsName = magicDnsName(await statusFile.read().const(effects))
    if (!dnsName) return

    for (const route of routes) {
      const hostId = await routeHostId(effects, route)
      if (!hostId) continue
      const internalPort = await sdk.host
        .get(
          effects,
          { hostId, packageId: route.packageId },
          (host) =>
            findIface(host, route.interfaceId)?.addressInfo?.internalPort ??
            null,
        )
        .const()
      if (internalPort === null) continue

      await sdk.plugin.url
        .exportUrl(effects, {
          hostnameInfo: {
            packageId: route.packageId,
            hostId,
            internalPort,
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
