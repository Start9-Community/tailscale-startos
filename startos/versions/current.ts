import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.96.5:0',
  releaseNotes: {
    en_US:
      'Initial release. Runs a Tailscale node on StartOS — sign it in from Tailscale’s own web interface, then expose selected StartOS service interfaces through it with Tailscale Serve (private, on your tailnet) or Funnel (public internet).',
    es_ES:
      'Versión inicial. Ejecuta un nodo de Tailscale en StartOS: inícialo desde la interfaz web de Tailscale y luego expón las interfaces de servicio de StartOS que elijas mediante Tailscale Serve (privado, en tu tailnet) o Funnel (internet público).',
    de_DE:
      'Erstveröffentlichung. Betreibt einen Tailscale-Knoten auf StartOS — melde ihn über die Weboberfläche von Tailscale an und stelle dann ausgewählte StartOS-Dienstschnittstellen darüber bereit, mit Tailscale Serve (privat, in deinem Tailnet) oder Funnel (öffentliches Internet).',
    pl_PL:
      'Wydanie początkowe. Uruchamia węzeł Tailscale w StartOS — zaloguj go w interfejsie webowym Tailscale, a następnie udostępniaj wybrane interfejsy usług StartOS przez Tailscale Serve (prywatnie, w twoim tailnecie) lub Funnel (publiczny internet).',
    fr_FR:
      'Version initiale. Exécute un nœud Tailscale sur StartOS — connectez-le depuis l’interface web de Tailscale, puis exposez les interfaces de service StartOS de votre choix via Tailscale Serve (privé, sur votre tailnet) ou Funnel (Internet public).',
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
