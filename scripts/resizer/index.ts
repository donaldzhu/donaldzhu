import { Device } from './constants'
import resize from './resize'

const config = {
  resizeThumbnails: false,
  resizeWork: true,
  includePages: ['i-voted'],
  includeBreakpts: [],
}

resize(Device.Desktop, config)