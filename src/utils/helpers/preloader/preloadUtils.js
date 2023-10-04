import { StringEnum } from '../enum'
export const MEDIA_SIZES = new StringEnum(['desktopFallback', 'full', 'original'])
export const MEDIA_TYPES = new StringEnum(['images', 'videos', 'toolTips', 'thumbnails', 'posters'])
export const SINGLE_MEDIA_TYPES = new StringEnum(['image', 'video'])
export const FILE_EXT = new StringEnum(['webm', 'webp'])
export const isImg = type => type === MEDIA_TYPES.images
export const isVid = type => type === MEDIA_TYPES.videos
export const isThumbnail = type => type === MEDIA_TYPES.thumbnails
export const isPoster = type => type === MEDIA_TYPES.posters