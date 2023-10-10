import { createStringEnum } from '../enum'
import breakpts from '../../../data/breakpoints'
import { getBreakptKey } from '../../queryUtil'
import _ from 'lodash'

export const MEDIA_SIZES = createStringEnum(['desktopFallback', 'preview', 'full', 'max'])
export const MEDIA_TYPES = createStringEnum(['images', 'videos', 'toolTips', 'thumbnails', 'posters'])
export const SINGLE_MEDIA_TYPES = createStringEnum(['image', 'video'])
export const FILE_EXT = createStringEnum(['webm', 'webp'])
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
export const getPreviewBreakptKey = () => {
  const breakpt = getBreakptKey()
  const breakptPairs = _.toPairs(breakpts)
  const breakptIndex = breakptPairs.findIndex(
    ([breakptKey]) => breakptKey === breakpt)
  return breakptIndex <= 1 ||
    breakptPairs[breakptIndex - 2][0]
}