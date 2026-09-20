import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.102.4:0',
  releaseNotes: {
    en_US: `Updated Tailscale to 1.102.4.

A patch release on the 1.102 client line: it fixes a loss of connectivity that could occur when a netmap update arrives near the time of reauthentication. The remaining fixes in this release are macOS, iOS, and tvOS only and do not affect this package. No state migration is required.

Full changelog: https://tailscale.com/changelog`,
    es_ES: `Actualiza Tailscale a 1.102.4.

Una versión de parche en la línea de cliente 1.102: corrige una pérdida de conectividad que podía producirse cuando una actualización del netmap llegaba cerca del momento de la reautenticación. Las demás correcciones de esta versión son solo para macOS, iOS y tvOS y no afectan a este paquete. No se requiere migración de estado.

Registro de cambios completo: https://tailscale.com/changelog`,
    de_DE: `Aktualisiert Tailscale auf 1.102.4.

Eine Patch-Version der 1.102-Client-Reihe: Sie behebt einen Verbindungsverlust, der auftreten konnte, wenn eine Netmap-Aktualisierung zeitnah zur erneuten Authentifizierung eintraf. Die übrigen Korrekturen dieser Version betreffen nur macOS, iOS und tvOS und wirken sich nicht auf dieses Paket aus. Es ist keine Zustandsmigration erforderlich.

Vollständiges Änderungsprotokoll: https://tailscale.com/changelog`,
    pl_PL: `Aktualizuje Tailscale do 1.102.4.

Wydanie poprawkowe w linii klienta 1.102: naprawia utratę łączności, która mogła wystąpić, gdy aktualizacja netmapy nadeszła blisko momentu ponownego uwierzytelnienia. Pozostałe poprawki w tym wydaniu dotyczą wyłącznie systemów macOS, iOS i tvOS i nie mają wpływu na ten pakiet. Migracja stanu nie jest wymagana.

Pełny dziennik zmian: https://tailscale.com/changelog`,
    fr_FR: `Met à jour Tailscale vers 1.102.4.

Une version corrective de la série de clients 1.102 : elle corrige une perte de connectivité pouvant survenir lorsqu'une mise à jour de la netmap arrive au moment de la réauthentification. Les autres corrections de cette version concernent uniquement macOS, iOS et tvOS et n'affectent pas ce paquet. Aucune migration d'état n'est requise.

Journal des modifications complet : https://tailscale.com/changelog`,
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
