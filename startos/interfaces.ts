import { sdk } from './sdk'

// Served services are reached over the tailnet, never through a StartOS interface.
export const setInterfaces = sdk.setupInterfaces(async () => [])
