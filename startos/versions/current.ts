import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.104.2:0',
  releaseNotes: {
    en_US:
      'Updated Tailscale to 1.104.2, a patch release built with Go 1.27.3, a toolchain security update.',
    es_ES:
      'Actualiza Tailscale a 1.104.2, una versión de parche compilada con Go 1.27.3, una actualización de seguridad de la cadena de herramientas.',
    de_DE:
      'Aktualisiert Tailscale auf 1.104.2, eine Patch-Version, die mit Go 1.27.3 erstellt wurde, einem Sicherheitsupdate der Toolchain.',
    pl_PL:
      'Aktualizuje Tailscale do 1.104.2, wydania poprawkowego zbudowanego z Go 1.27.3, aktualizacją bezpieczeństwa zestawu narzędzi.',
    fr_FR:
      'Met à jour Tailscale vers 1.104.2, une version corrective compilée avec Go 1.27.3, une mise à jour de sécurité de la chaîne d’outils.',
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
