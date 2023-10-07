exports.MAIN_CONTAINER_SIZE = 0.7
exports.TOOL_TIP_SIZE = 0.5
exports.MEDIA_ENLARGEMNET_FACTOR = 1
exports.TOOL_TIP_SUBFOLDER = 'toolTips'
exports.DESKTOP_FALLBACK_BREAKPOINT = 'desktopFallback'
exports.THUMBNAIL_KEY = '_thumbnails'
exports.THUMBNAIL_ROOT_PATH = `public/assets/thumbnails`
exports.POSTER_SUBPATH = 'posters'
exports.LOG_COLORS = {
  desktopFallback: 'gray',
  l: 'cyan',
  xl: 'green',
  xxl: 'magenta'
}
exports.MEDIA_TYPES = {
  images: 'images',
  imageGroups: 'imageGroups',
  videos: 'videos',
  toolTips: 'toolTips',
  thumbnails: 'thumbnails',
  posters: 'posters',
  thumbnailPosters: 'thumbnailPosters'
}

exports.MEDIA_SIZES = {
  desktopFallback: 'desktopFallback',
  l: 'l',
  xl: 'xl',
  xxl: 'xxl',
  original: 'original'
}

exports.FILE_EXT = {
  webm: 'webm',
  webp: 'webp',
  png: 'png'
}

exports.SKIP_IMG = false
exports.SKIP_VIDEO = false
exports.ONLY_PAGES = []
exports.EXCLUDE_SIZES = []
exports.THUMBNAIL_ORIGINAL_POSTER_PATH = `${exports.THUMBNAIL_ROOT_PATH}/${exports.MEDIA_SIZES.original}/${exports.POSTER_SUBPATH}`