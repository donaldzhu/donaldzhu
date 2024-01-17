import { Device } from './constants'
import resize from './resize'

const config = {
  resizeThumbnails: false,
  resizeWork: false,
  includePages: ['i-voted'],
  includeBreakpts: [],
}

resize(Device.Desktop, config)