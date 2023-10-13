import breakpts from '../../../data/breakpoints'
import { getBreakptKey } from '../../queryUtil'
import { ImgStack, MediaStack } from './mediaStack'
import { ImgPreloader, MediaPreloader } from './preloader'
import { toPairs } from '../../commonUtils'

export enum MediaSize {
  DesktopFallback = 'desktopFallback',
  Preview = 'preview',
  Full = 'full',
  Max = 'max'
}

export enum MediaType {
  Images = 'images',
  Videos = 'videos',
  ToolTips = 'toolTips',
  Thumbnails = 'thumbnails',
  Posters = 'posters'
}

export enum MediaFileType {
  Image = 'image',
  Video = 'video'
}

export enum FileExt {
  Webm = 'webm',
  Webp = 'webp'
}

export enum VerboseLevel {
  Quiet,
  Minimal,
  Normal,
  Diagnostic,
}

export function _isImg(media: MediaPreloader | MediaStack): media is ImgPreloader | ImgStack {
  return media.fileType === MediaFileType.Image
}
export const isImgSize = (size: MediaSize) => [MediaSize.DesktopFallback, MediaSize.Preview].includes(size)

export const isThumbnail = type => type === MediaType.Thumbnails
export const isPoster = type => type === MediaType.Posters
export const fileIsVid = fileName => {
  const imgRegex = new RegExp('.(gif|webp|png)$', 'i')
  const vidRegex = new RegExp('.webm$', 'i')
  if (fileName.match(imgRegex) || fileName.match(/\*$/)) return false
  if (fileName.match(vidRegex)) return true
  throw new Error(`${fileName} is neither an image nor a video.`)
}

export const getPreviewBreakptKey = () => {
  const breakpt = getBreakptKey()
  const breakptPairs = toPairs(breakpts)
  const breakptIndex = breakptPairs.findIndex(
    ([breakptKey]) => breakptKey === breakpt)
  return breakptIndex <= 1 ? breakptPairs[breakptIndex - 2][0] : undefined
}