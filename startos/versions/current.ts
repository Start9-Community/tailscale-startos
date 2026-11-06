import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.104.4:1',
  releaseNotes: {
    en_US:
      'HTTPS and Funnel serves now tell the served service that the connection is HTTPS, so redirects and CalDAV/CardDAV discovery (for example in Nextcloud) point to https:// addresses.',
    es_ES:
      'Los servicios publicados por HTTPS y Funnel ahora indican al servicio que la conexión es HTTPS, de modo que las redirecciones y el descubrimiento CalDAV/CardDAV (por ejemplo en Nextcloud) apuntan a direcciones https://.',
    de_DE:
      'HTTPS- und Funnel-Freigaben teilen dem bereitgestellten Dienst nun mit, dass die Verbindung HTTPS ist, sodass Weiterleitungen und die CalDAV/CardDAV-Erkennung (zum Beispiel in Nextcloud) auf https://-Adressen verweisen.',
    pl_PL:
      'Udostępnienia HTTPS i Funnel informują teraz udostępnianą usługę, że połączenie jest HTTPS, dzięki czemu przekierowania i wykrywanie CalDAV/CardDAV (na przykład w Nextcloud) wskazują adresy https://.',
    fr_FR:
      'Les publications HTTPS et Funnel indiquent désormais au service publié que la connexion est en HTTPS, de sorte que les redirections et la découverte CalDAV/CardDAV (par exemple dans Nextcloud) pointent vers des adresses https://.',
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
