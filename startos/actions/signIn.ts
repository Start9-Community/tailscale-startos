import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { loginServerField, signIn as runSignIn, signInResult } from '../utils'

export const signIn = sdk.Action.withInput(
  'sign-in',
  {
    name: i18n('Sign In'),
    description: i18n(
      'Get a link to sign this node in to your tailnet from any browser.',
    ),
    warning: null,
    allowedStatuses: 'only-running',
    group: null,
    visibility: 'enabled',
  },
  sdk.InputSpec.of({ loginServer: loginServerField() }),
  async () => null,
  async ({ effects, input }) =>
    signInResult(
      await runSignIn(effects, { loginServer: input.loginServer || null }),
    ),
)
