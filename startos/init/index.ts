import { actions } from '../actions'
import { restoreInit } from '../backups'
import { setDependencies } from '../dependencies'
import { setInterfaces } from '../interfaces'
import { sdk } from '../sdk'
import { registerUrlPlugin } from '../plugin/register'
import { syncExportedUrls } from '../plugin/sync'
import { versionGraph } from '../versions'

export const init = sdk.setupInit(
  restoreInit,
  versionGraph,
  setInterfaces,
  setDependencies,
  actions,
  registerUrlPlugin,
  syncExportedUrls,
)

export const uninit = sdk.setupUninit(versionGraph)
