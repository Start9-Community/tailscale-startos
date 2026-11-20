import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { statusGroup, withTailscaleCli } from '../utils'

export const nodeStatus = sdk.Action.withoutInput(
  'node-status',
  {
    name: i18n('Node Status'),
    description: i18n(
      'Show whether this node is signed in, and its tailnet, names, and Tailscale IPs.',
    ),
    warning: null,
    allowedStatuses: 'only-running',
    group: null,
    visibility: 'enabled',
  },
  async ({ effects }) => {
    const status = await withTailscaleCli(effects, (cli) => cli.status())
    return {
      version: '1',
      title: i18n('Node Status'),
      message: status.AuthURL
        ? i18n('Waiting for sign-in. Open this link to finish: ${url}', {
            url: status.AuthURL,
          })
        : status.Health?.length
          ? status.Health.join('\n')
          : null,
      result: statusGroup(status),
    }
  },
)
