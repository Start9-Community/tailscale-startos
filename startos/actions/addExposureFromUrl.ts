import { sdk } from '../sdk'
import { i18n } from '../i18n'
import {
  allocateLocalPort,
  isFunnelMode,
  isFunnelPort,
  routeId,
  serveConfig,
  type ServeMode,
} from '../fileModels/serveConfig'
import { targetSchemeFor } from '../utils'
import { syncExportedUrls } from '../plugin/sync'

const { InputSpec, Value } = sdk

// The url-v0 table prefills this hidden field with the target interface's identity;
// the SDK's `register`/`tableAction` contract guarantees all four fields are present.
type TableMetadata = {
  packageId: string
  interfaceId: string
  hostId: string
  internalPort: number
}

export const addExposureFromUrl = sdk.Action.withInput(
  'add-serve-from-url',
  async () => ({
    name: i18n('Serve On Tailscale'),
    description: i18n(
      'Serve this interface through this Tailscale node. Choose HTTPS or HTTP on your private tailnet, or Funnel to publish it on the public internet.',
    ),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'hidden',
  }),
  async ({ prefill }) => {
    // Default the published port to the target's own internal port.
    const internalPort = (
      prefill as { urlPluginMetadata?: { internalPort?: number } } | null
    )?.urlPluginMetadata?.internalPort
    return InputSpec.of({
      urlPluginMetadata: Value.hidden<TableMetadata>(),
      mode: Value.select({
        name: i18n('Serve Mode'),
        description: i18n(
          'HTTPS and HTTP keep this service on your private tailnet. Funnel publishes the same HTTPS endpoint on the PUBLIC INTERNET, reachable by anyone — only use it if that is what you want. Funnel is restricted to ports 443, 8443, and 10000.',
        ),
        default: 'https',
        values: {
          https: i18n('HTTPS (tailnet only, Tailscale-managed TLS)'),
          http: i18n('HTTP (tailnet only, no TLS)'),
          funnel: i18n('Funnel (PUBLIC HTTPS on the open internet)'),
        },
      }),
      externalPort: Value.number({
        name: i18n('Published Port'),
        description: i18n(
          'Other Tailscale devices connect to this node on this port.',
        ),
        default: internalPort ?? 443,
        required: true,
        integer: true,
        min: 1,
        max: 65535,
      }),
    })
  },
  // The platform fills urlPluginMetadata from the table row; no prefill needed here.
  async () => null,
  async ({ effects, input }) => {
    const metadata = input.urlPluginMetadata
    const mode = input.mode as ServeMode
    if (isFunnelMode(mode) && !isFunnelPort(input.externalPort)) {
      throw new Error(
        i18n(
          'Funnel only accepts ports 443, 8443, and 10000. Pick one of those for a Funnel serve.',
        ),
      )
    }

    const iface = await sdk.serviceInterface
      .get(effects, { packageId: metadata.packageId, id: metadata.interfaceId })
      .once()
    if (!iface?.addressInfo || !targetSchemeFor(iface.addressInfo)) {
      throw new Error(
        i18n(
          'That interface does not advertise HTTP, so it cannot be served through Tailscale.',
        ),
      )
    }

    const manifest = await sdk
      .getServiceManifest(effects, metadata.packageId)
      .once()
    const config = (await serveConfig.read().once()) ?? {
      version: 1 as const,
      routes: [],
    }
    const id = routeId(
      metadata.packageId,
      metadata.interfaceId,
      mode,
      input.externalPort,
    )

    if (config.routes.some((route) => route.id === id)) {
      throw new Error(
        i18n('That interface is already served with this mode and port.'),
      )
    }
    if (
      config.routes.some((route) => route.externalPort === input.externalPort)
    ) {
      throw new Error(
        i18n('Port ${port} is already in use by another Tailscale serve.', {
          port: String(input.externalPort),
        }),
      )
    }

    const route = {
      id,
      packageId: metadata.packageId,
      interfaceId: metadata.interfaceId,
      packageTitle: manifest?.title ?? metadata.packageId,
      interfaceName: iface.name,
      mode,
      externalPort: input.externalPort,
      localPort: allocateLocalPort(config.routes),
    }

    await serveConfig.write(effects, {
      version: 1,
      routes: [...config.routes, route],
    })
    await syncExportedUrls(effects)

    return {
      version: '1' as const,
      title: i18n('Tailscale Serve Added'),
      message: isFunnelMode(mode)
        ? i18n(
            'Saved. Funnel publishes this service on the PUBLIC INTERNET once this node is signed in and Funnel is enabled for your tailnet. The address appears in this service’s list shortly.',
          )
        : i18n(
            'Saved. The address appears in this service’s list once this node is signed in to your tailnet.',
          ),
      result: null,
    }
  },
)
