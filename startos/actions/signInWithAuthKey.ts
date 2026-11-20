import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { loginServerField, signIn, signInResult } from '../utils'

export const signInWithAuthKey = sdk.Action.withInput(
  'sign-in-auth-key',
  {
    name: i18n('Sign In with Auth Key'),
    description: i18n(
      'Sign this node in to your tailnet with an auth key generated in your tailnet’s admin console.',
    ),
    warning: null,
    allowedStatuses: 'only-running',
    group: null,
    visibility: 'enabled',
  },
  sdk.InputSpec.of({
    authKey: sdk.Value.text({
      name: i18n('Auth Key'),
      description: i18n(
        'An auth key from your tailnet’s admin console (Settings → Keys), or one your control server issued.',
      ),
      required: true,
      default: null,
      masked: true,
    }),
    loginServer: loginServerField(),
  }),
  async () => null,
  async ({ effects, input }) => {
    if (!input.authKey.trim()) {
      throw new Error(i18n('Enter an auth key.'))
    }
    return signInResult(
      await signIn(effects, {
        authKey: input.authKey.trim(),
        loginServer: input.loginServer || null,
      }),
    )
  },
)
