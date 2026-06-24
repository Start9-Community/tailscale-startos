import { sdk } from '../sdk'
import { addExposureFromUrl } from './addExposureFromUrl'
import { removeExposureFromUrl } from './removeExposureFromUrl'

// Both actions are hidden: they are invoked only from the StartOS url-v0 URL table
// (add via the table's "Serve On Tailscale" button, remove via each exported row).
// Signing in and managing the node happens in the Tailscale web interface.
export const actions = sdk.Actions.of()
  .addAction(addExposureFromUrl)
  .addAction(removeExposureFromUrl)
