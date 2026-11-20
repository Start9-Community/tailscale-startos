import { sdk } from '../sdk'
import { addExposureFromUrl } from './addExposureFromUrl'
import { logOut } from './logOut'
import { nodeStatus } from './nodeStatus'
import { removeExposureFromUrl } from './removeExposureFromUrl'
import { signIn } from './signIn'
import { signInWithAuthKey } from './signInWithAuthKey'

// The serve actions are hidden: they are invoked only from the StartOS url-v0 URL
// table (add via its "Serve On Tailscale" button, remove via each exported row).
export const actions = sdk.Actions.of()
  .addAction(signIn)
  .addAction(signInWithAuthKey)
  .addAction(nodeStatus)
  .addAction(logOut)
  .addAction(addExposureFromUrl)
  .addAction(removeExposureFromUrl)
