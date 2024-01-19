import { Device } from './constants'
import { MediaType } from './lib/resizerTypes'
import resize from './resize'

const desktopConfig = {
  resizeThumbnails: false,
  resizeWork: true,
  exportPages: [],
  exportBreakpts: [],
  exportTypes: []
}

const mobileConfig = {
  resizeThumbnails: true,
  resizeWork: true,
  exportPages: [],
  exportBreakpts: [],
  exportTypes: []
}


const run = async () => {
  await resize(Device.Desktop, desktopConfig)
  await resize(Device.Mobile, mobileConfig)
}

run()