import { actions } from '../actions'
import { restoreInit } from '../backups'
import { dependencies } from '../dependencies'
import { setInterfaces } from '../interfaces'
import { sdk } from '../sdk'
import { registerUrlPlugin } from '../plugin/register'
import { syncExportedUrls } from '../plugin/sync'
import { versionGraph } from '../versions'

export const init = sdk.setupInit(
  restoreInit,
  versionGraph,
  setInterfaces,
  actions,
  dependencies,
  registerUrlPlugin,
  syncExportedUrls,
)

export const uninit = sdk.setupUninit(versionGraph)
