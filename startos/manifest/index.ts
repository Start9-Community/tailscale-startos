import { setupManifest } from '@start9labs/start-sdk'
import { long, short } from './i18n'

export const manifest = setupManifest({
  id: 'tailscale',
  title: 'Tailscale',
  license: 'BSD-3-Clause',
  packageRepo: 'https://github.com/Start9-Community/tailscale-startos',
  upstreamRepo: 'https://github.com/tailscale/tailscale',
  marketingUrl: 'https://tailscale.com/',
  donationUrl: null,
  description: { short, long },
  volumes: ['main'],
  images: {
    tailscale: {
      source: {
        dockerBuild: {
          dockerfile: './Dockerfile',
        },
      },
      arch: ['x86_64', 'aarch64'],
    },
  },
  plugins: ['url-v0'],
  dependencies: {},
})
