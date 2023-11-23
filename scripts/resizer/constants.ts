import { Breakpt } from './resizeTypes'
import breakpoints from '../../src/data/breakpoints'
import { joinPaths } from '../utils'

export const ROOT_PATH = ''
export const DESTINATION_ROOT = 'public/assets/desktop'

export const SRC_PATH = joinPaths(ROOT_PATH, 'asset-original', 'desktop')
export const THUMBNAIL_FOLDER = 'thumbnails'
export const SRC_THUMBNAIL_PATH = joinPaths(SRC_PATH, THUMBNAIL_FOLDER)
export const WORK_FOLDER = 'work'
export const SRC_WORK_PATH = joinPaths(SRC_PATH, WORK_FOLDER)
export const POSTER_SUBFOLDER = 'posters'

export const SIZE_PATH = 'scripts/resizer/sizes/desktop'
export const NATIVE_DIMENSIONS_PATH = 'src/data/media/nativeDimensions/desktop.json'

export const MAX_FOLDER = 'max'
export const BLUR = 4

export const BREAKPT_WIDTHS: Record<Breakpt, number> = {
  [Breakpt.DesktopFallback]: 600,
  [Breakpt.S]: breakpoints.s,
  [Breakpt.M]: breakpoints.m,
  [Breakpt.L]: breakpoints.l,
  [Breakpt.Xl]: breakpoints.xl,
  [Breakpt.Xxl]: breakpoints.xxl
}

export type DesktopBreakpts = Breakpt.DesktopFallback | Breakpt.L | Breakpt.Xl | Breakpt.Xxl
export type MobileBreakpts = Breakpt.S | Breakpt.M | Breakpt.L

export const DEFAULT_CONFIG = {
  resizeThumbnails: true,
  resizeWork: true,
  includePages: [],
  includeBreakpts: []
}

export const MAIN_RESIZE_PERCENTAGE = 0.7
export const TOOL_TIP_PERCENTAGE = 0.5