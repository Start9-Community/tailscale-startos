import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.104.1:0',
  releaseNotes: {
    en_US:
      'Updated Tailscale to 1.104.1: client-side netmap caching improves start-up speed and connectivity while the Tailscale control plane is unreachable, and WireGuard uses less memory under heavy traffic.',
    es_ES:
      'Actualiza Tailscale a 1.104.1: el almacenamiento en caché del netmap en el cliente mejora la velocidad de inicio y la conectividad mientras el plano de control de Tailscale no está accesible, y WireGuard usa menos memoria con tráfico intenso.',
    de_DE:
      'Aktualisiert Tailscale auf 1.104.1: Das clientseitige Zwischenspeichern der Netmap verbessert die Startgeschwindigkeit und die Konnektivität, solange die Tailscale-Steuerungsebene nicht erreichbar ist, und WireGuard benötigt bei starkem Datenverkehr weniger Speicher.',
    pl_PL:
      'Aktualizuje Tailscale do 1.104.1: buforowanie netmapy po stronie klienta przyspiesza uruchamianie i poprawia łączność, gdy warstwa kontrolna Tailscale jest nieosiągalna, a WireGuard zużywa mniej pamięci przy dużym ruchu.',
    fr_FR:
      'Met à jour Tailscale vers 1.104.1 : la mise en cache de la netmap côté client améliore la vitesse de démarrage et la connectivité lorsque le plan de contrôle de Tailscale est inaccessible, et WireGuard consomme moins de mémoire en cas de trafic intense.',
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
