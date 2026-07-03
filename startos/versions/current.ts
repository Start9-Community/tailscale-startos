import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.96.5:2',
  releaseNotes: {
    en_US: `Updated to the StartOS 2.0 SDK (requires StartOS 0.4.0-beta.10). Serves now reach their target over the internal LXC bridge, which fixes serving the StartOS admin UI itself — previously a Tailscale serve for it was accepted but never actually forwarded.`,
    es_ES: `Actualizado al SDK 2.0 de StartOS (requiere StartOS 0.4.0-beta.10). Los serves ahora alcanzan su destino a través del puente LXC interno, lo que corrige el servicio de la propia interfaz de administración de StartOS: antes se aceptaba un serve de Tailscale para ella pero nunca se reenviaba realmente.`,
    de_DE: `Auf das StartOS-2.0-SDK aktualisiert (erfordert StartOS 0.4.0-beta.10). Serves erreichen ihr Ziel jetzt über die interne LXC-Bridge, was das Bereitstellen der StartOS-Verwaltungsoberfläche selbst behebt — zuvor wurde ein Tailscale-Serve dafür zwar akzeptiert, aber nie tatsächlich weitergeleitet.`,
    pl_PL: `Zaktualizowano do SDK StartOS 2.0 (wymaga StartOS 0.4.0-beta.10). Serve'y docierają teraz do celu przez wewnętrzny mostek LXC, co naprawia udostępnianie samego interfejsu administracyjnego StartOS — wcześniej serve Tailscale dla niego był akceptowany, ale nigdy faktycznie nie przekazywał ruchu.`,
    fr_FR: `Mise à jour vers le SDK StartOS 2.0 (nécessite StartOS 0.4.0-beta.10). Les serves atteignent désormais leur cible via le pont LXC interne, ce qui corrige la diffusion de l'interface d'administration de StartOS elle-même — auparavant, un serve Tailscale pour celle-ci était accepté mais n'était jamais réellement transmis.`,
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
