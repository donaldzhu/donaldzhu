import { Device } from './constants'
import { MediaType } from './lib/resizerTypes'
import resize from './resize'

const config = {
  resizeThumbnails: false,
  resizeWork: true,
  exportPages: ['roll'],
  exportBreakpts: [],
  exportTypes: []
}


resize(Device.Desktop, config)