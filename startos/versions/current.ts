import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

export const current = VersionInfo.of({
  version: '1.104.7:1',
  releaseNotes: {
    en_US: `Requires StartOS 0.4.2 or later.

Sign-in moves from Tailscale's web interface to actions.

- The **Tailscale Admin** interface is removed. Its page could sign this node in to any tailnet without asking for a password, so it is no longer reachable from your network. Any domain you attached to it is removed with it.
- New actions: **Sign In** (a link to open or scan), **Sign In with Auth Key**, **Node Status** and **Log Out**. Both sign-in actions take an optional login server, for a self-hosted control server such as Headscale.
- A node that is already signed in stays signed in, and every serve keeps working. If this node was never signed in, a task points you to **Sign In**.`,
    es_ES: `Requiere StartOS 0.4.2 o posterior.

El inicio de sesión pasa de la interfaz web de Tailscale a acciones.

- Se elimina la interfaz **Tailscale Admin**. Su página podía iniciar la sesión de este nodo en cualquier tailnet sin pedir contraseña, así que ya no es accesible desde tu red. Cualquier dominio que le hubieras asignado se elimina con ella.
- Nuevas acciones: **Iniciar sesión** (un enlace para abrir o escanear), **Iniciar sesión con clave de autenticación**, **Estado del nodo** y **Cerrar sesión**. Ambas acciones de inicio de sesión aceptan un servidor de inicio de sesión opcional, para un servidor de control autoalojado como Headscale.
- Un nodo que ya tiene la sesión iniciada la mantiene, y todos los serves siguen funcionando. Si este nodo nunca inició sesión, una tarea te lleva a **Iniciar sesión**.`,
    de_DE: `Erfordert StartOS 0.4.2 oder neuer.

Die Anmeldung wechselt von der Weboberfläche von Tailscale zu Aktionen.

- Die Schnittstelle **Tailscale Admin** entfällt. Ihre Seite konnte diesen Knoten ohne Passwort in einem beliebigen Tailnet anmelden, daher ist sie aus deinem Netzwerk nicht mehr erreichbar. Eine Domain, die du ihr zugewiesen hattest, wird mit ihr entfernt.
- Neue Aktionen: **Anmelden** (ein Link zum Öffnen oder Scannen), **Mit Auth-Key anmelden**, **Knotenstatus** und **Abmelden**. Beide Anmeldeaktionen nehmen optional einen Anmeldeserver an, für einen selbst gehosteten Steuerungsserver wie Headscale.
- Ein bereits angemeldeter Knoten bleibt angemeldet, und alle Serves funktionieren weiter. Wurde dieser Knoten nie angemeldet, führt dich eine Aufgabe zu **Anmelden**.`,
    pl_PL: `Wymaga StartOS 0.4.2 lub nowszego.

Logowanie przenosi się z interfejsu webowego Tailscale do akcji.

- Interfejs **Tailscale Admin** zostaje usunięty. Jego strona mogła zalogować ten węzeł do dowolnego tailnetu bez pytania o hasło, więc nie jest już osiągalna z twojej sieci. Każda domena, którą do niego przypisałeś, zostaje usunięta razem z nim.
- Nowe akcje: **Zaloguj** (link do otwarcia lub zeskanowania), **Zaloguj kluczem uwierzytelniającym**, **Stan węzła** i **Wyloguj**. Obie akcje logowania przyjmują opcjonalny serwer logowania, dla samodzielnie hostowanego serwera sterującego, takiego jak Headscale.
- Węzeł, który jest już zalogowany, pozostaje zalogowany, a wszystkie serve działają dalej. Jeśli ten węzeł nigdy nie był zalogowany, zadanie poprowadzi cię do **Zaloguj**.`,
    fr_FR: `Nécessite StartOS 0.4.2 ou version ultérieure.

La connexion passe de l’interface web de Tailscale à des actions.

- L’interface **Tailscale Admin** est supprimée. Sa page pouvait connecter ce nœud à n’importe quel tailnet sans demander de mot de passe ; elle n’est donc plus joignable depuis votre réseau. Tout domaine que vous lui aviez attribué est supprimé avec elle.
- Nouvelles actions : **Se connecter** (un lien à ouvrir ou à scanner), **Se connecter avec une clé d’authentification**, **État du nœud** et **Se déconnecter**. Les deux actions de connexion acceptent un serveur de connexion facultatif, pour un serveur de contrôle auto-hébergé comme Headscale.
- Un nœud déjà connecté le reste, et tous les serves continuent de fonctionner. Si ce nœud n’a jamais été connecté, une tâche vous mène à **Se connecter**.`,
  },
  migrations: {
    up: async ({ effects }) => {
      await sdk.MultiHost.of(effects, 'web').retire()
    },
    down: IMPOSSIBLE,
  },
})
