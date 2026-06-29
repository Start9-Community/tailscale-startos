import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.96.5:1',
  releaseNotes: {
    en_US:
      'Adds a raw TCP serve mode. Non-web services such as LND or electrs can now be exposed over your tailnet by host:port, alongside the existing HTTP, HTTPS, and Funnel modes — choose “TCP” from a service’s “Serve On Tailscale” action.',
    es_ES:
      'Añade un modo de servicio TCP sin procesar. Los servicios que no son web, como LND o electrs, ahora se pueden exponer en tu tailnet por host:puerto, junto con los modos HTTP, HTTPS y Funnel existentes: elige «TCP» en la acción «Servir en Tailscale» de un servicio.',
    de_DE:
      'Fügt einen rohen TCP-Bereitstellungsmodus hinzu. Nicht-Web-Dienste wie LND oder electrs können jetzt über host:port in deinem Tailnet bereitgestellt werden, zusätzlich zu den bestehenden Modi HTTP, HTTPS und Funnel — wähle „TCP“ in der Aktion „Über Tailscale bereitstellen“ eines Dienstes.',
    pl_PL:
      'Dodaje surowy tryb udostępniania TCP. Usługi inne niż webowe, takie jak LND lub electrs, można teraz udostępniać w tailnecie przez host:port, obok istniejących trybów HTTP, HTTPS i Funnel — wybierz „TCP” w akcji „Udostępnij przez Tailscale” danej usługi.',
    fr_FR:
      'Ajoute un mode de service TCP brut. Les services non web comme LND ou electrs peuvent désormais être exposés sur votre tailnet par hôte:port, en plus des modes HTTP, HTTPS et Funnel existants — choisissez « TCP » dans l’action « Servir via Tailscale » d’un service.',
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
