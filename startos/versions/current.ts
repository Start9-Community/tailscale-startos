import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.102.5:0',
  releaseNotes: {
    en_US: `Updated Tailscale to 1.102.5.

A patch release on the 1.102 client line, and its one fix lands squarely on this package: \`tailscaled\` no longer stops when the client falls behind on status updates and the connection is closed, which was common on large tailnets. It reconnects instead, and exits only if it cannot reconnect within one minute. No state migration is required.

Full changelog: https://tailscale.com/changelog

- **Stop Tailscale Serve** says what stops working before you confirm it.
- The **Serve Mode** field of **Serve On Tailscale** describes each mode on its own line, including what HTTPS and Funnel need enabled for your tailnet.`,
    es_ES: `Actualiza Tailscale a 1.102.5.

Una versión de parche en la línea de cliente 1.102, y su única corrección afecta directamente a este paquete: \`tailscaled\` ya no se detiene cuando el cliente se retrasa en las actualizaciones de estado y se cierra la conexión, algo habitual en tailnets grandes. En su lugar se reconecta, y solo termina si no logra reconectarse en un minuto. No se requiere migración de estado.

Registro de cambios completo: https://tailscale.com/changelog

- **Detener Tailscale Serve** indica qué deja de funcionar antes de que lo confirmes.
- El campo **Modo de servicio** de **Servir en Tailscale** describe cada modo en su propia línea, incluido lo que debe estar habilitado en tu tailnet para HTTPS y Funnel.`,
    de_DE: `Aktualisiert Tailscale auf 1.102.5.

Eine Patch-Version der 1.102-Client-Reihe, deren einzige Korrektur genau dieses Paket betrifft: \`tailscaled\` wird nicht mehr beendet, wenn der Client bei Statusaktualisierungen zurückfällt und die Verbindung geschlossen wird, was in großen Tailnets häufig vorkam. Stattdessen verbindet er sich neu und beendet sich nur, wenn die Neuverbindung nicht innerhalb einer Minute gelingt. Es ist keine Zustandsmigration erforderlich.

Vollständiges Änderungsprotokoll: https://tailscale.com/changelog

- **Tailscale Serve stoppen** sagt, was nicht mehr funktioniert, bevor du es bestätigst.
- Das Feld **Bereitstellungsmodus** von **Über Tailscale bereitstellen** beschreibt jeden Modus in einer eigenen Zeile, einschließlich dessen, was für HTTPS und Funnel in deinem Tailnet aktiviert sein muss.`,
    pl_PL: `Aktualizuje Tailscale do 1.102.5.

Wydanie poprawkowe w linii klienta 1.102, a jego jedyna poprawka dotyczy bezpośrednio tego pakietu: \`tailscaled\` nie zatrzymuje się już, gdy klient nie nadąża z aktualizacjami statusu i połączenie zostaje zamknięte, co było częste w dużych tailnetach. Zamiast tego łączy się ponownie i kończy działanie tylko wtedy, gdy nie uda mu się połączyć w ciągu minuty. Migracja stanu nie jest wymagana.

Pełny dziennik zmian: https://tailscale.com/changelog

- **Zatrzymaj Tailscale Serve** informuje, co przestanie działać, zanim to potwierdzisz.
- Pole **Tryb udostępniania** w **Udostępnij przez Tailscale** opisuje każdy tryb w osobnym wierszu, w tym to, co musi być włączone w twoim tailnecie dla HTTPS i Funnel.`,
    fr_FR: `Met à jour Tailscale vers 1.102.5.

Une version corrective de la série de clients 1.102, dont l'unique correction concerne directement ce paquet : \`tailscaled\` ne s'arrête plus lorsque le client prend du retard sur les mises à jour de statut et que la connexion est fermée, ce qui était fréquent sur les grands tailnets. Il se reconnecte à la place, et ne se termine que s'il ne parvient pas à se reconnecter en une minute. Aucune migration d'état n'est requise.

Journal des modifications complet : https://tailscale.com/changelog

- **Arrêter Tailscale Serve** indique ce qui cesse de fonctionner avant que vous ne confirmiez.
- Le champ **Mode de service** de **Servir via Tailscale** décrit chaque mode sur sa propre ligne, y compris ce qui doit être activé sur votre tailnet pour HTTPS et Funnel.`,
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
