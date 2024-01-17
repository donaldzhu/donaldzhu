import { Breakpt } from './resizeTypes'
import breakpoints from '../../../src/data/breakpoints'

export const THUMBNAIL_FOLDER = 'thumbnails'
export const WORK_FOLDER = 'work'
export const MAX_FOLDER = 'max'


export const BLUR = 4
export const DESKTOP_MAX_SIZE = 2500 * 3000
export const MOBILE_MAX_SIZE = 1500 * 2000

export enum Device {
  Mobile = 'mobile',
  Desktop = 'desktop'
}

export const BREAKPT_WIDTHS: Record<Breakpt, number> = {
  [Breakpt.DesktopFallback]: 600,
  [Breakpt.MobileFallback]: 250,
  [Breakpt.S]: breakpoints.s,
  [Breakpt.M]: breakpoints.m,
  [Breakpt.L]: breakpoints.l,
  [Breakpt.Xl]: breakpoints.xl,
  [Breakpt.Xxl]: breakpoints.xxl
}

export const DEFAULT_CONFIG = {
  resizeThumbnails: true,
  resizeWork: true,
  includePages: [],
  includeBreakpts: []
}
