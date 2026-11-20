import { signIn } from '../actions/signIn'
import { statusFile } from '../fileModels/status'
import { i18n } from '../i18n'
import { sdk } from '../sdk'

export const taskSignIn = sdk.setupOnInit(async (effects) => {
  if (
    (await statusFile.read((s) => s.BackendState).const(effects)) === 'Running'
  ) {
    await sdk.action.clearTask(effects, 'tailscale:sign-in')
    return
  }
  await sdk.action.createOwnTask(effects, signIn, 'important', {
    reason: i18n('Sign this node in to your tailnet'),
  })
})
