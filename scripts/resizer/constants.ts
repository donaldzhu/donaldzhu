import { Breakpts, configType } from './resizeTypes'
import breakpoints from '../../src/data/breakpoints.json'
import { joinPaths } from '../utils'

export const ROOT_PATH = ''
export const DESTINATION_ROOT = 'public/assets'

export const SRC_PATH = joinPaths(ROOT_PATH, 'asset-original')
export const THUMBNAIL_FOLDER = 'thumbnails'
export const SRC_THUMBNAIL_PATH = joinPaths(SRC_PATH, THUMBNAIL_FOLDER)
export const WORK_FOLDER = 'work'
export const SRC_WORK_PATH = joinPaths(SRC_PATH, WORK_FOLDER)
export const POSTER_SUBFOLDER = 'posters'

export const SIZE_PATH = 'scripts/resizer/sizes'
export const NATIVE_DIMENSIONS_PATH = 'src/data/media/nativeDimensions.json'

export const MAX_FOLDER = 'max'
export const BLUR = 4

export const BREAKPT_WIDTHS: Record<Breakpts, number> = {
  [Breakpts.desktopFallback]: 600,
  [Breakpts.l]: breakpoints.l,
  [Breakpts.xl]: breakpoints.xl,
  [Breakpts.xxl]: breakpoints.xxl
}

export const DEFAULT_CONFIG: configType = {
  resizeThumbnails: true,
  resizeWork: true,
  includePages: [],
  includeBreakpts: []
}

export const MAIN_RESIZE_PERCENTAGE = 0.7
export const TOOL_TIP_PERCENTAGE = 0.5