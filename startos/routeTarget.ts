import type { ServeMode } from './fileModels/serveConfig'
import { targetSchemeFor, type AddressInfoLike } from './utils'

type RouteTargetInput = {
  packageId: string
  hostId?: string
  interfaceId: string
  mode: ServeMode
}

type ResolvedRouteTarget = {
  scheme: 'http' | 'https+insecure' | 'tcp'
  useSslBridge: boolean
}

/** Select the protocol and bridge endpoint used by a route's local forwarder. */
export function resolveRouteTarget(
  route: RouteTargetInput,
  addressInfo: AddressInfoLike,
): ResolvedRouteTarget | null {
  const isStartOsAdmin =
    route.packageId === 'start-os' &&
    addressInfo.hostId === 'admin' &&
    route.interfaceId === 'admin-ui'

  if (route.mode === 'tcp') {
    return { scheme: 'tcp', useSslBridge: isStartOsAdmin }
  }
  if (isStartOsAdmin) {
    return { scheme: 'https+insecure', useSslBridge: true }
  }

  const scheme = targetSchemeFor(addressInfo)
  return scheme ? { scheme, useSslBridge: scheme === 'https+insecure' } : null
}
