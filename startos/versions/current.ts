import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.104.4:0',
  releaseNotes: {
    en_US:
      'Updated Tailscale to 1.104.4, a security release for Tailscale Serve and Tailscale SSH. Serve no longer proxies to the tailscaled socket and no longer leaks app capabilities between mounts.',
    es_ES:
      'Actualiza Tailscale a 1.104.4, una versión de seguridad para Tailscale Serve y Tailscale SSH. Serve ya no hace de proxy hacia el socket de tailscaled ni filtra capacidades de aplicación entre montajes.',
    de_DE:
      'Aktualisiert Tailscale auf 1.104.4, eine Sicherheitsversion für Tailscale Serve und Tailscale SSH. Serve leitet nicht mehr an den tailscaled-Socket weiter und gibt keine App-Berechtigungen mehr zwischen Mounts weiter.',
    pl_PL:
      'Aktualizuje Tailscale do 1.104.4, wydania bezpieczeństwa dla Tailscale Serve i Tailscale SSH. Serve nie przekazuje już ruchu do gniazda tailscaled i nie przenosi już uprawnień aplikacji między punktami montowania.',
    fr_FR:
      'Met à jour Tailscale vers 1.104.4, une version de sécurité pour Tailscale Serve et Tailscale SSH. Serve ne relaie plus vers le socket de tailscaled et ne divulgue plus les capacités d’application entre les points de montage.',
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
