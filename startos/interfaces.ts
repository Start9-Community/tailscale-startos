import { sdk } from './sdk'
import { i18n } from './i18n'
import { WEB_UI_PORT } from './utils'

// Tailscale's own web client. This is the package's auth/management surface: the
// user opens it to sign the node in and to see its status. The served StartOS
// services are reached over the tailnet itself, not through a StartOS interface.
export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  const host = sdk.MultiHost.of(effects, 'web')
  const origin = await host.bindPort(WEB_UI_PORT, { protocol: 'http' })
  const ui = sdk.createInterface(effects, {
    name: i18n('Tailscale Admin'),
    id: 'web',
    description: i18n(
      'Tailscale’s own web interface — sign this node in and manage it here.',
    ),
    type: 'ui',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '',
    query: {},
  })
  return [await origin.export([ui])]
})
