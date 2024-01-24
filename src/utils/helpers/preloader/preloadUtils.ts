import _ from 'lodash'
import { Breakpt, type Device } from '../../breakptTypes'
import { getBreakptKey, getIsMobile } from '../../queryUtil'
import { sortLike } from '../../commonUtils'
import type { MediaStack } from './mediaStack'
import type { MediaBreakpts } from './preloaderTypes'


export enum MediaSize {
  Fallback = 'fallback',
  Preview = 'preview',
  Full = 'full',
  Max = 'max'
}

export enum Fallback {
  DesktopFallback = 'desktopFallback',
  MobileFallback = 'mobileFallback'
}

export enum MediaType {
  Images = 'images',
  Videos = 'videos',
  ToolTips = 'toolTips',
  Poster = 'poster'
}

export enum MediaFileType {
  Image = 'image',
  Video = 'video'
}

export enum ImgExt {
  Webp = 'webp',
  Png = 'png',
  Gif = 'gif'
}

export enum VidExt {
  Webm = 'webm',
  Mp4 = 'mp4'
}

export enum Verbosity {
  Quiet,
  Minimal,
  Normal,
  Diagnostic,
}

export const POSTER_SUBFOLDER = 'posters'

const orderedBreakpts = [
  Fallback.MobileFallback,
  Fallback.DesktopFallback,
  Breakpt.S,
  Breakpt.M,
  Breakpt.L,
  Breakpt.Xl,
  Breakpt.Xxl,
  MediaSize.Max
]

const imgRegex = new RegExp(`.(${Object.values(ImgExt).join('|')})$`, 'i')
const vidRegex = new RegExp(`.(${Object.values(VidExt).join('|')})$`, 'i')
export const fileIsImg = (fileName: string) => {
  if (!!fileName.match(imgRegex) || !!fileName.match(/\*$/)) return true
  if (fileName.match(vidRegex)) return false
  throw new Error(`${fileName} is neither an image nor a video.`)
}

export const getPosterFile = (fileName: string) =>
  fileName.replace(vidRegex, '.' + ImgExt.Webp)

export const getHighestBreakpt = (isZoomed?: boolean, ...breakpts: typeof orderedBreakpts) => {
  let sizes = _.chain(sortLike(breakpts, orderedBreakpts))
  if (!isZoomed) sizes = sizes.without(MediaSize.Max)
  return sizes.last().value() as MediaBreakpts | undefined
}

export const getStackBreakpt = (
  mediaStack: MediaStack<MediaBreakpts>,
  isZoomed?: boolean
) => getHighestBreakpt(isZoomed, ...mediaStack.loadedSizes)


export const getFallbackKey = () => getIsMobile(false) ?
  Fallback.MobileFallback : Fallback.DesktopFallback

// TODO
export const getPreviewBreakptKey = (device: Device) => {
  const breakpt = getBreakptKey(device)
  return breakpt === Breakpt.L ? Breakpt.S :
    breakpt === Breakpt.Xxl ? Breakpt.L : undefined
}