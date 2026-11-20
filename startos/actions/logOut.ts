import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { STATUS_FILE, tailscale, withTailscaleCli } from '../utils'

export const logOut = sdk.Action.withoutInput(
  'log-out',
  {
    name: i18n('Log Out'),
    description: i18n(
      'Sign this node out of your tailnet. Run Sign In afterwards to sign it in again, to the same account or another one.',
    ),
    warning: i18n(
      'Signs this node out of your tailnet and restarts Tailscale. Every interface it serves stops being reachable over Tailscale until you sign in again.',
    ),
    allowedStatuses: 'only-running',
    group: null,
    visibility: 'enabled',
  },
  async ({ effects }) => {
    await withTailscaleCli(effects, async (cli) => {
      await cli.exec(tailscale('logout'), { timeout: 30_000 })
      await cli.exec([
        'sh',
        '-c',
        `${tailscale().join(' ')} status --json > ${STATUS_FILE}`,
      ])
    })
    await sdk.restart(effects)
    return null
  },
)
