import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.104.7:0',
  releaseNotes: {
    en_US:
      'Updated Tailscale to 1.104.7. Fixes connectivity stalls for Tailscale SSH and Serve on lossy networks, a rare issue with dormant connections, and control plane connections broken by some middleboxes.',
    es_ES:
      'Actualiza Tailscale a 1.104.7. Corrige bloqueos de conectividad de Tailscale SSH y Serve en redes con pérdidas, un problema poco frecuente con conexiones inactivas y conexiones al plano de control interrumpidas por algunos equipos intermedios.',
    de_DE:
      'Aktualisiert Tailscale auf 1.104.7. Behebt Verbindungsabbrüche bei Tailscale SSH und Serve in verlustbehafteten Netzwerken, ein seltenes Problem mit ruhenden Verbindungen und Verbindungen zur Steuerungsebene, die von manchen Middleboxes unterbrochen wurden.',
    pl_PL:
      'Aktualizuje Tailscale do 1.104.7. Naprawia przestoje połączeń Tailscale SSH i Serve w sieciach ze stratami pakietów, rzadki problem z uśpionymi połączeniami oraz połączenia z płaszczyzną sterowania zrywane przez niektóre urządzenia pośredniczące.',
    fr_FR:
      'Met à jour Tailscale vers 1.104.7. Corrige les blocages de connectivité de Tailscale SSH et Serve sur les réseaux avec pertes, un problème rare avec les connexions inactives et les connexions au plan de contrôle interrompues par certains équipements intermédiaires.',
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
