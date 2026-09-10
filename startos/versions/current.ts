import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.102.3:0',
  releaseNotes: {
    en_US: `Updated Tailscale to 1.102.3.

This release moves onto the 1.102 client line (from 1.98.9): a regression that broke incoming Tailscale Funnel connections is fixed, userspace TUN throughput is improved (this package runs tailscaled in userspace-networking mode), Serve connections now report bytes-sent and bytes-received metrics, a memory leak after a failed WireGuard handshake is fixed, unqualified hostnames are forwarded to the configured nameservers when MagicDNS is disabled, and host-scoped IPv4 destinations are now refused for unmapped 4via6 addresses. No state migration is required.

Full changelog: https://tailscale.com/changelog`,
    es_ES: `Actualiza Tailscale a 1.102.3.

Esta versión pasa a la línea de cliente 1.102 (desde 1.98.9): se corrige una regresión que impedía las conexiones entrantes de Tailscale Funnel, mejora el rendimiento del TUN en espacio de usuario (este paquete ejecuta tailscaled en modo userspace-networking), las conexiones de Serve ahora informan métricas de bytes enviados y recibidos, se corrige una fuga de memoria tras un handshake de WireGuard fallido, los nombres de host sin cualificar se reenvían a los servidores de nombres configurados cuando MagicDNS está desactivado y ahora se rechazan los destinos IPv4 con ámbito de host para direcciones 4via6 no asignadas. No se requiere migración de estado.

Registro de cambios completo: https://tailscale.com/changelog`,
    de_DE: `Aktualisiert Tailscale auf 1.102.3.

Diese Version wechselt auf die 1.102-Client-Reihe (von 1.98.9): Eine Regression, die eingehende Tailscale-Funnel-Verbindungen verhinderte, ist behoben, der Durchsatz des Userspace-TUN ist verbessert (dieses Paket betreibt tailscaled im Userspace-Networking-Modus), Serve-Verbindungen melden jetzt Metriken zu gesendeten und empfangenen Bytes, ein Speicherleck nach einem fehlgeschlagenen WireGuard-Handshake ist behoben, nicht qualifizierte Hostnamen werden bei deaktiviertem MagicDNS an die konfigurierten Nameserver weitergeleitet, und host-begrenzte IPv4-Ziele werden für nicht zugeordnete 4via6-Adressen nun abgelehnt. Es ist keine Zustandsmigration erforderlich.

Vollständiges Änderungsprotokoll: https://tailscale.com/changelog`,
    pl_PL: `Aktualizuje Tailscale do 1.102.3.

Ta wersja przechodzi na linię klienta 1.102 (z 1.98.9): naprawiono regresję blokującą przychodzące połączenia Tailscale Funnel, poprawiono przepustowość TUN w przestrzeni użytkownika (ten pakiet uruchamia tailscaled w trybie userspace-networking), połączenia Serve zgłaszają teraz metryki wysłanych i odebranych bajtów, naprawiono wyciek pamięci po nieudanym handshake'u WireGuard, niekwalifikowane nazwy hostów są przekazywane do skonfigurowanych serwerów nazw przy wyłączonym MagicDNS, a docelowe adresy IPv4 o zasięgu hosta są teraz odrzucane dla niezmapowanych adresów 4via6. Migracja stanu nie jest wymagana.

Pełny dziennik zmian: https://tailscale.com/changelog`,
    fr_FR: `Met à jour Tailscale vers 1.102.3.

Cette version passe à la série de clients 1.102 (depuis 1.98.9) : une régression qui empêchait les connexions entrantes Tailscale Funnel est corrigée, le débit du TUN en espace utilisateur est amélioré (ce paquet exécute tailscaled en mode userspace-networking), les connexions Serve remontent désormais des métriques d'octets envoyés et reçus, une fuite de mémoire après un handshake WireGuard échoué est corrigée, les noms d'hôtes non qualifiés sont transmis aux serveurs de noms configurés lorsque MagicDNS est désactivé, et les destinations IPv4 à portée d'hôte sont désormais refusées pour les adresses 4via6 non mappées. Aucune migration d'état n'est requise.

Journal des modifications complet : https://tailscale.com/changelog`,
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
