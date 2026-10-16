import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.104.1:0',
  releaseNotes: {
    en_US:
      'Updated Tailscale to 1.104.1: client-side netmap caching improves start-up speed and connectivity while the Tailscale control plane is unreachable, and WireGuard uses less memory under heavy traffic. Tailscale shows as running while this node is signed out of its tailnet.',
    es_ES:
      'Actualiza Tailscale a 1.104.1: el almacenamiento en caché del netmap en el cliente mejora la velocidad de inicio y la conectividad mientras el plano de control de Tailscale no está accesible, y WireGuard usa menos memoria con tráfico intenso. Tailscale aparece en ejecución mientras este nodo tiene la sesión cerrada en su tailnet.',
    de_DE:
      'Aktualisiert Tailscale auf 1.104.1: Das clientseitige Zwischenspeichern der Netmap verbessert die Startgeschwindigkeit und die Konnektivität, solange die Tailscale-Steuerungsebene nicht erreichbar ist, und WireGuard benötigt bei starkem Datenverkehr weniger Speicher. Tailscale wird als laufend angezeigt, solange dieser Knoten von seinem Tailnet abgemeldet ist.',
    pl_PL:
      'Aktualizuje Tailscale do 1.104.1: buforowanie netmapy po stronie klienta przyspiesza uruchamianie i poprawia łączność, gdy warstwa kontrolna Tailscale jest nieosiągalna, a WireGuard zużywa mniej pamięci przy dużym ruchu. Tailscale jest pokazywany jako uruchomiony, gdy ten węzeł jest wylogowany ze swojej sieci tailnet.',
    fr_FR:
      'Met à jour Tailscale vers 1.104.1 : la mise en cache de la netmap côté client améliore la vitesse de démarrage et la connectivité lorsque le plan de contrôle de Tailscale est inaccessible, et WireGuard consomme moins de mémoire en cas de trafic intense. Tailscale apparaît comme en cours d’exécution tant que ce nœud est déconnecté de son tailnet.',
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
