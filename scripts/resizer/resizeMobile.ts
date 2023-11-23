import fs from 'fs'
import _ from 'lodash'
import Resizer from './lib/resizer'
import { MediaType, breakptSize } from './lib/resizerTypes'
import { joinPaths, loopObject, mapObject, mapObjectPromises, readJsonSync } from '../utils'
import { BreakptExports, Breakpt, BreakptSizeCollection, MobileBreakpts, SizesJson, fileDataPair, DimensionsJson, dimension, FileDataCollection, ConfigType } from './resizeTypes'
import { BREAKPT_WIDTHS, MAX_FOLDER, THUMBNAIL_FOLDER, WORK_FOLDER, DEFAULT_CONFIG, Device, BLUR } from './constants'
import { getNoSizesError, getPaths, getResizeCallback } from './resizeUtils'


const {
  SRC_THUMBNAIL_PATH,
  SRC_WORK_PATH,
  DESTINATION_THUMBNAIL_PATH,
  DESTINATION_WORK_PATH,
  SIZE_PATH,
  NATIVE_DIMENSIONS_PATH,
} = getPaths(Device.Mobile)

const getBreakptConfig = (breakpt: Breakpt, sizes: breakptSize[], debugOnly: boolean) => {
  return {
    breakpt,
    breakptWidth: BREAKPT_WIDTHS[breakpt],
    sizes,
    blur: breakpt === Breakpt.MobileFallback ? BLUR : undefined,
    exclude: breakpt === Breakpt.MobileFallback ? [MediaType.Video] : undefined,
    debugOnly
  }
}

const resizeMobile = async (config?: ConfigType<MobileBreakpts>) => {
  const {
    resizeThumbnails,
    resizeWork,
    includePages,
    includeBreakpts
  } = { ...(DEFAULT_CONFIG satisfies ConfigType<MobileBreakpts>), ...config }

  const mobileBreakpts: Record<MobileBreakpts, number> =
    _.pick(BREAKPT_WIDTHS, Breakpt.S, Breakpt.M, Breakpt.L)

  const breakptWidths = includeBreakpts.length ? _.pick(mobileBreakpts, ...includeBreakpts) : mobileBreakpts
  const breakptSizes: SizesJson = readJsonSync(joinPaths(SIZE_PATH, 'all.json'))

  const pageSizes: Record<string, BreakptSizeCollection> = {}
  loopObject(breakptWidths, (breakpt) => {
    const { work } = breakptSizes
    if (!work || Array.isArray(work)) throw getNoSizesError(breakptSizes, WORK_FOLDER)
    loopObject(work, (pageId, sizes) =>
      (pageSizes[pageId] ||= {} as BreakptSizeCollection)[breakpt] = sizes)
  })

  const nativeDimensions: DimensionsJson = {}

  const thumbnailConfigs = mapObject(
    breakptWidths, breakpt => {
      const { thumbnails } = breakptSizes
      if (!thumbnails || !Array.isArray(thumbnails)) throw getNoSizesError(breakptSizes, THUMBNAIL_FOLDER)
      return getBreakptConfig(breakpt, [thumbnails[0]], !resizeThumbnails)
    }
  )

  const thumbnails: fileDataPair<dimension>[] = []
  await new Resizer<BreakptExports>(
    SRC_THUMBNAIL_PATH,
    Object.values(thumbnailConfigs),
    {
      destination: DESTINATION_THUMBNAIL_PATH,
      callback: getResizeCallback(thumbnails, SRC_THUMBNAIL_PATH)
    }
  ).init()
  nativeDimensions.thumbnails = thumbnails

  const work: FileDataCollection<dimension> = {}
  await mapObjectPromises(pageSizes, async (pageId, breakptSizes) => {
    const includePage = !includePages.length || includePages.includes(pageId)
    const debugOnly = !resizeWork || !includePage
    const pageConfigs = mapObject(breakptSizes,
      (breakpt, sizes) => getBreakptConfig(breakpt, sizes, debugOnly))

    const maxConfig = {
      breakpt: MAX_FOLDER,
      sizes: pageConfigs.l.sizes,
      noResize: true,
      maxDimension: 1500 * 2000,
      debugOnly
    }

    const workPage: fileDataPair<dimension>[] = []
    await new Resizer(
      joinPaths(SRC_WORK_PATH, pageId),
      [...Object.values(pageConfigs), maxConfig],
      {
        destination: joinPaths(DESTINATION_WORK_PATH, pageId),
        callback: getResizeCallback(workPage, joinPaths(SRC_WORK_PATH, pageId))
      }
    ).init()
    work[pageId] = workPage
  })
  nativeDimensions.work = work

  fs.writeFileSync(NATIVE_DIMENSIONS_PATH, JSON.stringify(nativeDimensions))

}

export default resizeMobile