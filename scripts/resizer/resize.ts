import fs from 'fs'
import _ from 'lodash'
import Resizer from './lib/resizer'
import { breakptSize, MediaType } from './lib/resizerTypes'
import { joinPaths, loopObject, mapObject, mapObjectPromises, readJsonSync } from '../utils'
import { BreakptExports, Breakpt, DesktopBreakpts, BreakptSizeCollection, SizesJson, fileDataPair, DimensionsJson, dimension, FileDataCollection, ConfigType, MobileBreakpts } from './resizeTypes'
import { BLUR, BREAKPT_WIDTHS, DEFAULT_CONFIG, DESKTOP_MAX_SIZE, Device, MAX_FOLDER, MOBILE_MAX_SIZE, THUMBNAIL_FOLDER, WORK_FOLDER } from './constants'
import { getNoSizesError, getPaths, getResizeCallback } from './resizeUtils'


const resize = async <T extends Device, B extends (T extends Device.Desktop ? DesktopBreakpts : MobileBreakpts)>(
  device: T,
  config?: ConfigType<B>
) => {
  const {
    SRC_THUMBNAIL_PATH,
    SRC_WORK_PATH,
    DESTINATION_THUMBNAIL_PATH,
    DESTINATION_WORK_PATH,
    SIZE_PATH,
    NATIVE_DIMENSIONS_PATH,
  } = getPaths(device)

  const isDesktop = device === Device.Desktop
  const fallbackBreakpt = isDesktop ? Breakpt.DesktopFallback : Breakpt.MobileFallback

  const getBreakptConfig = (breakpt: Breakpt, sizes: breakptSize[], debugOnly: boolean) => {
    if (isDesktop) sizes.map((size) =>
      size[1] *= size[0].match(/^toolTips\//) ? 0.5 : 0.7)
    return {
      breakpt,
      breakptWidth: BREAKPT_WIDTHS[breakpt],
      sizes,
      blur: breakpt === fallbackBreakpt ? BLUR : undefined,
      exclude: breakpt === fallbackBreakpt ? [MediaType.Video] : undefined,
      debugOnly
    }
  }


  const {
    resizeThumbnails,
    resizeWork,
    includePages,
    includeBreakpts
  } = { ...(DEFAULT_CONFIG satisfies ConfigType<B>), ...config }

  const desktopBreakpts = [Breakpt.DesktopFallback, Breakpt.L, Breakpt.Xl, Breakpt.Xxl]
  const mobileBreakpts = [Breakpt.MobileFallback, Breakpt.S, Breakpt.M, Breakpt.L]
  const deviceBreakpts: Record<B, number> =
    _.pick(BREAKPT_WIDTHS, ...(isDesktop ? desktopBreakpts : mobileBreakpts))

  const breakptWidths = includeBreakpts.length ? _.pick(deviceBreakpts, ...includeBreakpts) : deviceBreakpts

  const breakptSizes = mapObject<typeof breakptWidths, SizesJson>(breakptWidths, breakpt =>
    readJsonSync(joinPaths(SIZE_PATH, `${isDesktop ? breakpt : 'all'}.json`)))

  const pageSizes: Record<string, BreakptSizeCollection> = {}

  loopObject(breakptSizes, (breakpt, allSizes) => {
    const { work } = allSizes
    if (!work || Array.isArray(work)) throw getNoSizesError(allSizes, WORK_FOLDER)
    loopObject(work, (pageId, sizes) =>
      (pageSizes[pageId] ||= {} as BreakptSizeCollection)[breakpt] = sizes)
  })

  const nativeDimensions: DimensionsJson = {}

  const thumbnailConfigs = mapObject(
    breakptSizes, (breakpt, sizes) => {
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
    const pageConfigs = mapObject(breakptSizes,
      (breakpt, sizes) => getBreakptConfig(breakpt, sizes, debugOnly))

    const maxConfig = {
      breakpt: MAX_FOLDER,
      sizes: isDesktop ? pageConfigs.xxl.sizes : pageConfigs.l.sizes,
      noResize: true,
      maxDimension: isDesktop ? DESKTOP_MAX_SIZE : MOBILE_MAX_SIZE,
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

export default resize
