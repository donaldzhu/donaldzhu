import breakpts from '../../../data/breakpoints'
import { toPairs } from '../../commonUtils'
import { Breakpt, getBreakptKey } from '../../queryUtil'

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
  Thumbnails = 'thumbnails'
}

export enum MediaFileType {
  Image = 'image',
  Video = 'video'
}

export enum FileExt {
  Webm = 'webm',
  Webp = 'webp',
  Mp4 = 'mp4'
}

export enum Verbosity {
  Quiet,
  Minimal,
  Normal,
  Diagnostic,
}

export const isImgSize = (size: MediaSize) =>
  [MediaSize.DesktopFallback, MediaSize.Preview].includes(size)

// TODO
export const fileIsImg = (fileName: string) => {
  const imgRegex = new RegExp('.(gif|webp|png)$', 'i')
  const vidRegex = new RegExp('.(webm|mp4)$', 'i')
  if (!!fileName.match(imgRegex) || !!fileName.match(/\*$/)) return true
  if (fileName.match(vidRegex)) return false
  throw new Error(`${fileName} is neither an image nor a video.`)
}

// export const getPreviewBreakptKey = () => {
//   const breakpt = getBreakptKey()
//   const breakptPairs = toPairs(breakpts)
//   const breakptIndex = breakptPairs.findIndex(
//     ([breakptKey]) => breakptKey === breakpt)
//   const previewBreakptKey = breakptPairs[breakptIndex - 2][0]
//   // TODO
//   return (breakptIndex > 1 && previewBreakptKey === Breakpt.L) ? previewBreakptKey : undefined
// }

// TODO
export const getPreviewBreakptKey = () => {
  const breakpt = getBreakptKey()
  return breakpt === Breakpt.L ? Breakpt.S :
    breakpt === Breakpt.Xxl ? Breakpt.L : undefined
}

export const orderedBreakpts = [
  MediaSize.DesktopFallback,
  Breakpt.S,
  Breakpt.M,
  Breakpt.L,
  Breakpt.Xl,
  Breakpt.Xxl,
  MediaSize.Max
]