import fs from 'fs'
import _ from 'lodash'
import Resizer from './lib/resizer'
import { BreakptConfig, breakptSize, MediaType } from './lib/resizerTypes'
import { joinPaths, mapObject, mapObjectPromises, readJsonSync } from '../utils'
import { BreakptExports, Breakpt, DesktopBreakpts, BreakptSizeCollection, SizesJson, fileDataPair, DimensionsJson, dimension, FileDataCollection, ConfigType } from './resizeTypes'
import { BLUR, BREAKPT_WIDTHS, DEFAULT_CONFIG, Device, MAX_FOLDER, THUMBNAIL_FOLDER, WORK_FOLDER } from './constants'
import { getNoSizesError, getPaths, getResizeCallback } from './resizeUtils'

const {
  SRC_THUMBNAIL_PATH,
  SRC_WORK_PATH,
  DESTINATION_THUMBNAIL_PATH,
  DESTINATION_WORK_PATH,
  SIZE_PATH,
  NATIVE_DIMENSIONS_PATH,
} = getPaths(Device.Desktop)

const getBreakptConfig = (breakpt: Breakpt, sizes: breakptSize[], debugOnly: boolean) => {
  sizes.map((size) => size[1] *= size[0].match(/^toolTips\//) ? 0.5 : 0.7)
  return {
    breakpt,
    breakptWidth: BREAKPT_WIDTHS[breakpt],
    sizes,
    blur: breakpt === Breakpt.DesktopFallback ? BLUR : undefined,
    exclude: breakpt === Breakpt.DesktopFallback ? [MediaType.Video] : undefined,
    debugOnly
  }
}

const resizeDesktop = async (config?: ConfigType<DesktopBreakpts>) => {
  const {
    resizeThumbnails,
    resizeWork,
    includePages,
    includeBreakpts
  } = { ...(DEFAULT_CONFIG satisfies ConfigType<DesktopBreakpts>), ...config }

  const desktopBreakpts: Record<DesktopBreakpts, number> =
    _.pick(BREAKPT_WIDTHS, Breakpt.DesktopFallback, Breakpt.L, Breakpt.Xl, Breakpt.Xxl)
  const breakptWidths = includeBreakpts.length ? _.pick(desktopBreakpts, ...includeBreakpts) : desktopBreakpts

  const allBreakptSizes = mapObject<typeof breakptWidths, SizesJson>(breakptWidths, breakpt =>
    readJsonSync(joinPaths(SIZE_PATH, `${breakpt}.json`)))

  const pageSizes: Record<string, BreakptSizeCollection> = {}
  mapObject(allBreakptSizes, (breakpt, allSizes) => {
    const { work } = allSizes
    if (!work || Array.isArray(work)) throw getNoSizesError(allSizes, WORK_FOLDER)

    mapObject(work, (pageId, sizes) =>
      (pageSizes[pageId] ||= {} as BreakptSizeCollection)[breakpt] = sizes)
  })

  const nativeDimensions: DimensionsJson = {}

  const thumbnailConfigs = mapObject<typeof allBreakptSizes, BreakptConfig<Breakpt>>(
    allBreakptSizes, (breakpt, sizes) => {
      const { thumbnails } = sizes
      if (!thumbnails || !Array.isArray(thumbnails)) throw getNoSizesError(sizes, THUMBNAIL_FOLDER)
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

    const pageConfigs = mapObject<BreakptSizeCollection, BreakptConfig<Breakpt>>(breakptSizes,
      (breakpt, sizes) => getBreakptConfig(breakpt, sizes, debugOnly))

    const maxConfig = {
      breakpt: MAX_FOLDER,
      sizes: pageConfigs.xxl.sizes,
      noResize: true,
      maxDimension: 2500 * 3000,
      exclude: [MediaType.Poster],
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

export default resizeDesktop
