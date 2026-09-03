import assert from 'node:assert/strict'
import test from 'node:test'
import { resolveRouteTarget } from './routeTarget'

const adminAddress = {
  hostId: 'admin',
  internalPort: 80,
  scheme: 'http',
  sslScheme: 'https',
}

test('StartOS admin web routes use the SSL bridge endpoint', () => {
  for (const mode of ['https', 'http', 'funnel'] as const) {
    assert.deepEqual(
      resolveRouteTarget(
        {
          packageId: 'start-os',
          hostId: 'admin',
          interfaceId: 'admin-ui',
          mode,
        },
        adminAddress,
      ),
      { scheme: 'https+insecure', useSslBridge: true },
    )
  }
})

test('StartOS admin TCP routes retain a TCP target over the SSL bridge endpoint', () => {
  assert.deepEqual(
    resolveRouteTarget(
      {
        packageId: 'start-os',
        hostId: 'admin',
        interfaceId: 'admin-ui',
        mode: 'tcp',
      },
      adminAddress,
    ),
    { scheme: 'tcp', useSslBridge: true },
  )
})

test('legacy StartOS admin routes are recognized from the resolved interface host', () => {
  assert.deepEqual(
    resolveRouteTarget(
      {
        packageId: 'start-os',
        interfaceId: 'admin-ui',
        mode: 'https',
      },
      adminAddress,
    ),
    { scheme: 'https+insecure', useSslBridge: true },
  )
})

test('ordinary package routes preserve their advertised HTTP target', () => {
  assert.deepEqual(
    resolveRouteTarget(
      {
        packageId: 'docuseal',
        hostId: 'ui-multi',
        interfaceId: 'ui',
        mode: 'https',
      },
      {
        hostId: 'ui-multi',
        internalPort: 3000,
        scheme: 'http',
        sslScheme: null,
      },
    ),
    { scheme: 'http', useSslBridge: false },
  )
})

test('non-HTTP interfaces are rejected for web modes', () => {
  assert.equal(
    resolveRouteTarget(
      {
        packageId: 'electrs',
        hostId: 'rpc',
        interfaceId: 'rpc',
        mode: 'https',
      },
      {
        hostId: 'rpc',
        internalPort: 50001,
        scheme: null,
        sslScheme: null,
      },
    ),
    null,
  )
})
