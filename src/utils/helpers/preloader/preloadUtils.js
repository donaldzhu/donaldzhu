import { StringEnum } from '../enum'
import breakpoints from '../../../data/breakpoints.json'
import { getBreakpointKey } from '../../queryUtil'
import _ from 'lodash'

export const MEDIA_SIZES = new StringEnum(['desktopFallback', 'preview', 'full', 'max'])
export const MEDIA_TYPES = new StringEnum(['images', 'videos', 'toolTips', 'thumbnails', 'posters'])
export const SINGLE_MEDIA_TYPES = new StringEnum(['image', 'video'])
export const FILE_EXT = new StringEnum(['webm', 'webp'])
export const isImg = type => type === MEDIA_TYPES.images
export const isVid = type => type === MEDIA_TYPES.videos
export const isThumbnail = type => type === MEDIA_TYPES.thumbnails
export const isPoster = type => type === MEDIA_TYPES.posters
export const fileIsVid = fileName => {
  const imgRegex = new RegExp('.(gif|webp|png)$', 'i')
  const vidRegex = new RegExp('.webm$', 'i')
  if (fileName.match(imgRegex) || fileName.match(/\*$/)) return false
  if (fileName.match(vidRegex)) return true
  throw new Error(`${fileName} is neither an image nor a video.`)
}
export const isImgSize = size => [MEDIA_SIZES.desktopFallback, MEDIA_SIZES.preview].includes(size)
export const getPreviewBreakpointKey = () => {
  const breakpoint = getBreakpointKey()
  const breakpointPairs = _.toPairs(breakpoints)
  const breakpointIndex = breakpointPairs.findIndex(
    ([breakptKey]) => breakptKey === breakpoint)
  return breakpointIndex <= 1 ||
    breakpointPairs[breakpointIndex - 2][0]
}