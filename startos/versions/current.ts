import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.98.8:0',
  releaseNotes: {
    en_US: `Updated Tailscale to 1.98.8. This bump brings the 1.98 client line: fixes for wireguard-go connectivity drops when a system wakes from sleep and for excessive handshake retries, a MagicDNS resolution regression after network changes, and more consistent Linux netfilter rule application after mode changes; it also adds the new \`ip:publicAddress\` device-posture attribute (beta). Full changelog: https://tailscale.com/changelog. Also includes internal updates for start-sdk 2.0.`,
    es_ES: `Tailscale actualizado a 1.98.8. Esta actualización trae la línea de cliente 1.98: correcciones para las caídas de conectividad de wireguard-go al despertar el sistema tras la suspensión y para los reintentos excesivos de handshake, una regresión en la resolución de MagicDNS tras cambios de red, y una aplicación más consistente de las reglas de netfilter en Linux tras cambios de modo; también añade el nuevo atributo de postura del dispositivo \`ip:publicAddress\` (beta). Registro de cambios completo: https://tailscale.com/changelog. También incluye actualizaciones internas para start-sdk 2.0.`,
    de_DE: `Tailscale auf 1.98.8 aktualisiert. Dieses Update bringt die 1.98-Client-Reihe: Korrekturen für wireguard-go-Verbindungsabbrüche beim Aufwachen des Systems aus dem Ruhezustand und für übermäßige Handshake-Wiederholungen, eine MagicDNS-Auflösungsregression nach Netzwerkänderungen sowie eine konsistentere Anwendung von Linux-netfilter-Regeln nach Moduswechseln; außerdem wird das neue Geräte-Posture-Attribut \`ip:publicAddress\` (Beta) hinzugefügt. Vollständiges Änderungsprotokoll: https://tailscale.com/changelog. Enthält außerdem interne Aktualisierungen für start-sdk 2.0.`,
    pl_PL: `Zaktualizowano Tailscale do 1.98.8. Ta aktualizacja wprowadza linię klienta 1.98: poprawki dotyczące utraty łączności wireguard-go po wybudzeniu systemu ze snu oraz nadmiernych ponownych prób handshake, regresji rozwiązywania MagicDNS po zmianach sieci, a także bardziej spójnego stosowania reguł netfilter w systemie Linux po zmianach trybu; dodaje również nowy atrybut postawy urządzenia \`ip:publicAddress\` (beta). Pełny dziennik zmian: https://tailscale.com/changelog. Zawiera także wewnętrzne aktualizacje dla start-sdk 2.0.`,
    fr_FR: `Tailscale mis à jour vers 1.98.8. Cette mise à jour apporte la série de clients 1.98 : corrections des coupures de connectivité de wireguard-go au réveil du système après une mise en veille et des tentatives de handshake excessives, une régression de la résolution MagicDNS après des changements de réseau, ainsi qu'une application plus cohérente des règles netfilter sous Linux après des changements de mode ; elle ajoute également le nouvel attribut de posture d'appareil \`ip:publicAddress\` (bêta). Journal des modifications complet : https://tailscale.com/changelog. Inclut également des mises à jour internes pour start-sdk 2.0.`,
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
