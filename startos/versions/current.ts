import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.98.9:0',
  releaseNotes: {
    en_US: `Updated Tailscale to 1.98.9.

This release also migrates the package to start-sdk 2.0 (requires StartOS 0.4.0-beta.10 or later) and moves onto the 1.98 client line (from 1.96.5): fixes for wireguard-go connectivity drops on wake-from-sleep and excessive handshake retries, a MagicDNS resolution regression after network changes, and more consistent Linux netfilter rule application. No state migration is required.

Full changelog: https://tailscale.com/changelog`,
    es_ES: `Actualiza Tailscale a 1.98.9.

Esta versión también migra el paquete a start-sdk 2.0 (requiere StartOS 0.4.0-beta.10 o posterior) y pasa a la línea de cliente 1.98 (desde 1.96.5): correcciones para las caídas de conectividad de wireguard-go al despertar del reposo y para los reintentos excesivos de handshake, una regresión en la resolución de MagicDNS tras cambios de red y una aplicación más consistente de las reglas de netfilter en Linux. No se requiere migración de estado.

Registro de cambios completo: https://tailscale.com/changelog`,
    de_DE: `Aktualisiert Tailscale auf 1.98.9.

Diese Version stellt das Paket außerdem auf start-sdk 2.0 um (erfordert StartOS 0.4.0-beta.10 oder neuer) und wechselt auf die 1.98-Client-Reihe (von 1.96.5): Korrekturen für wireguard-go-Verbindungsabbrüche beim Aufwachen aus dem Ruhezustand und für übermäßige Handshake-Wiederholungen, eine MagicDNS-Auflösungsregression nach Netzwerkänderungen sowie eine konsistentere Anwendung der Linux-netfilter-Regeln. Es ist keine Zustandsmigration erforderlich.

Vollständiges Änderungsprotokoll: https://tailscale.com/changelog`,
    pl_PL: `Aktualizuje Tailscale do 1.98.9.

Ta wersja przenosi też pakiet na start-sdk 2.0 (wymaga StartOS 0.4.0-beta.10 lub nowszego) i przechodzi na linię klienta 1.98 (z 1.96.5): poprawki dotyczące utraty łączności wireguard-go po wybudzeniu ze snu i nadmiernych ponownych prób handshake, regresji rozwiązywania MagicDNS po zmianach sieci oraz bardziej spójnego stosowania reguł netfilter w systemie Linux. Migracja stanu nie jest wymagana.

Pełny dziennik zmian: https://tailscale.com/changelog`,
    fr_FR: `Met à jour Tailscale vers 1.98.9.

Cette version fait également passer le paquet à start-sdk 2.0 (nécessite StartOS 0.4.0-beta.10 ou une version ultérieure) et passe à la série de clients 1.98 (depuis 1.96.5) : corrections des coupures de connectivité de wireguard-go au réveil après une mise en veille et des tentatives de handshake excessives, une régression de la résolution MagicDNS après des changements de réseau, ainsi qu'une application plus cohérente des règles netfilter sous Linux. Aucune migration d'état n'est requise.

Journal des modifications complet : https://tailscale.com/changelog`,
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
