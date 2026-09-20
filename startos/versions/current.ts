import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.102.4:1',
  releaseNotes: {
    en_US: `Package fixes; Tailscale stays at 1.102.4.

- A serve that Tailscale did not apply (an HTTPS or Funnel serve without HTTPS Certificates enabled for the tailnet, for example) now shows as a failed **Tailscale Serve** health check naming the route, instead of reporting healthy.
- Serving an interface again after its service was reinstalled works: the address reappears on its own, re-adding the same serve refreshes it instead of failing, and a port held by a serve whose service was uninstalled is released.
- An interface that offers only an HTTPS endpoint can be served on StartOS 0.4.0.2 and later.`,
    es_ES: `Correcciones del paquete; Tailscale se mantiene en 1.102.4.

- Un serve que Tailscale no aplicó (por ejemplo, un serve HTTPS o Funnel sin certificados HTTPS habilitados para la tailnet) ahora aparece como una comprobación de salud **Tailscale Serve** fallida que indica la ruta, en lugar de informar que todo está bien.
- Volver a servir una interfaz después de reinstalar su servicio funciona: la dirección reaparece por sí sola, volver a añadir el mismo serve lo actualiza en lugar de fallar, y se libera un puerto retenido por un serve cuyo servicio fue desinstalado.
- Una interfaz que solo ofrece un extremo HTTPS puede servirse en StartOS 0.4.0.2 y posteriores.`,
    de_DE: `Paketkorrekturen; Tailscale bleibt bei 1.102.4.

- Ein Serve, den Tailscale nicht angewendet hat (zum Beispiel ein HTTPS- oder Funnel-Serve ohne aktivierte HTTPS-Zertifikate für das Tailnet), erscheint jetzt als fehlgeschlagene **Tailscale Serve**-Gesundheitsprüfung, die die Route benennt, statt als gesund gemeldet zu werden.
- Eine Schnittstelle nach der Neuinstallation ihres Dienstes erneut bereitzustellen funktioniert: Die Adresse erscheint von selbst wieder, das erneute Hinzufügen desselben Serves aktualisiert ihn, statt fehlzuschlagen, und ein Port, den ein Serve eines deinstallierten Dienstes belegt, wird freigegeben.
- Eine Schnittstelle, die nur einen HTTPS-Endpunkt anbietet, kann unter StartOS 0.4.0.2 und neuer bereitgestellt werden.`,
    pl_PL: `Poprawki pakietu; Tailscale pozostaje w wersji 1.102.4.

- Serve, którego Tailscale nie zastosował (na przykład serve HTTPS lub Funnel bez włączonych certyfikatów HTTPS dla tailnetu), jest teraz widoczny jako nieudana kontrola stanu **Tailscale Serve** wskazująca trasę, zamiast zgłaszać poprawny stan.
- Ponowne udostępnienie interfejsu po ponownej instalacji jego usługi działa: adres pojawia się ponownie sam, ponowne dodanie tego samego serve odświeża go zamiast kończyć się błędem, a port zajęty przez serve odinstalowanej usługi jest zwalniany.
- Interfejs oferujący wyłącznie punkt końcowy HTTPS można udostępniać w StartOS 0.4.0.2 i nowszych.`,
    fr_FR: `Corrections du paquet ; Tailscale reste en 1.102.4.

- Un serve que Tailscale n'a pas appliqué (par exemple un serve HTTPS ou Funnel sans certificats HTTPS activés pour le tailnet) apparaît désormais comme un contrôle de santé **Tailscale Serve** en échec nommant la route, au lieu d'être signalé comme sain.
- Servir de nouveau une interface après la réinstallation de son service fonctionne : l'adresse réapparaît d'elle-même, rajouter le même serve l'actualise au lieu d'échouer, et un port occupé par un serve dont le service a été désinstallé est libéré.
- Une interface qui n'offre qu'un point de terminaison HTTPS peut être servie sur StartOS 0.4.0.2 et versions ultérieures.`,
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
