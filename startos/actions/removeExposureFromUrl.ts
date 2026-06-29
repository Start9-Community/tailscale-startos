import { sdk } from '../sdk'
import { i18n } from '../i18n'
import { serveConfig, serveModeLabel } from '../fileModels/serveConfig'
import { syncExportedUrls } from '../plugin/sync'

const { InputSpec, Value } = sdk

// The remove control hands back the same PluginHostnameInfo we exported; our route
// id rides along in the (untyped-by-the-SDK) `info` blob.
const inputSpec = InputSpec.of({
  urlPluginMetadata: Value.hidden<{
    interfaceId: string
    packageId: string | null
    hostId: string
    internalPort: number
    ssl: boolean
    public: boolean
    hostname: string
    port: number | null
    info: unknown
  }>(),
})

function unsupportedTargetResult() {
  return {
    version: '1' as const,
    title: i18n('Unsupported Target'),
    message: i18n(
      'This URL entry did not come from a normal package service interface, so it cannot be removed through this action.',
    ),
    result: null,
  }
}

export const removeExposureFromUrl = sdk.Action.withInput(
  'remove-serve-from-url',
  async () => ({
    name: i18n('Stop Tailscale Serve'),
    description: i18n(
      'Stop serving this interface through this Tailscale node.',
    ),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'hidden',
  }),
  inputSpec,
  // The platform fills urlPluginMetadata from the exported row; no prefill needed.
  async () => null,
  async ({ effects, input }) => {
    const targetId = (
      input.urlPluginMetadata.info as { routeId?: string } | null
    )?.routeId
    if (!targetId) return unsupportedTargetResult()

    const config = (await serveConfig.read().once()) ?? {
      version: 1 as const,
      routes: [],
    }
    const route = config.routes.find((candidate) => candidate.id === targetId)
    if (!route) {
      throw new Error(i18n('That Tailscale serve no longer exists.'))
    }

    await serveConfig.write(effects, {
      version: 1,
      routes: config.routes.filter((candidate) => candidate.id !== route.id),
    })
    await syncExportedUrls(effects)

    return {
      version: '1' as const,
      title: i18n('Tailscale Serve Removed'),
      message: i18n(
        'This node stops serving that interface over Tailscale within a few seconds.',
      ),
      result: {
        type: 'single' as const,
        value: i18n('${title} → ${iface} (${mode}, port ${port})', {
          title: route.packageTitle,
          iface: route.interfaceName,
          mode: serveModeLabel(route.mode),
          port: String(route.externalPort),
        }),
        copyable: false,
        qr: false,
        masked: false,
      },
    }
  },
)
