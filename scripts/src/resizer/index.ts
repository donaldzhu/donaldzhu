import { Device } from './constants'
import { MediaType } from './lib/resizerTypes'
import resize from './resize'

const desktopConfig = {
  resizeThumbnails: true,
  resizeWork: true,
  exportPages: [],
  exportBreakpts: [],
  exportTypes: [MediaType.Dash]
}

// const mobileConfig = {
//   resizeThumbnails: true,
//   resizeWork: true,
//   exportPages: [],
//   exportBreakpts: [],
//   exportTypes: []
// }


const run = async () => {
  await resize(Device.Mobile, desktopConfig)
}

run()