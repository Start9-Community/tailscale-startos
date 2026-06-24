import { sdk } from '../sdk'
import { addExposureFromUrl } from '../actions/addExposureFromUrl'

// Registers the `url-v0` plugin so a "Serve On Tailscale" button appears on the
// URL table of every other installed service. Clicking it runs `addExposureFromUrl`.
export const registerUrlPlugin = sdk.setupOnInit(async (effects) =>
  sdk.plugin.url.register(effects, { tableAction: addExposureFromUrl }),
)
