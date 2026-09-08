import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.98.9:3',
  releaseNotes: {
    en_US: `Fixes serving an interface that offers only an HTTPS endpoint.

Requires StartOS 0.4.0.2.`,
    es_ES: `Corrige la publicación de una interfaz que solo ofrece un extremo HTTPS.

Requiere StartOS 0.4.0.2.`,
    de_DE: `Behebt das Bereitstellen einer Schnittstelle, die nur einen HTTPS-Endpunkt anbietet.

Erfordert StartOS 0.4.0.2.`,
    pl_PL: `Naprawia udostępnianie interfejsu, który oferuje wyłącznie punkt końcowy HTTPS.

Wymaga StartOS 0.4.0.2.`,
    fr_FR: `Corrige la publication d'une interface qui n'offre qu'un point de terminaison HTTPS.

Nécessite StartOS 0.4.0.2.`,
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
