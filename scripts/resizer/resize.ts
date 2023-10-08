import fs from 'fs'
import path from 'path'
import _ from 'lodash'
import Resizer from './lib/resizer'
import { BreakptConfig, BreakptSize, MediaTypes, dimensionType } from './lib/resizerTypes'
import { joinPaths, mapObject, mapObjectPromises, readJsonSync } from '../utils'
import { BreakptExports, Breakpts, breakptSizeCollection, sizesJson, fileDataPair, size, dimensionsJson, dimension, fileDataCollection, configType } from './resizeTypes'
import { BLUR, BREAKPT_WIDTHS, DESTINATION_ROOT, MAX_FOLDER, ROOT_PATH, THUMBNAIL_FOLDER, WORK_FOLDER, DEFAULT_CONFIG, NATIVE_DIMENSIONS_PATH, SRC_WORK_PATH, SRC_THUMBNAIL_PATH, SIZE_PATH, TOOL_TIP_PERCENTAGE, MAIN_RESIZE_PERCENTAGE } from './constants'

const createBreakptMap = <T, V>(
  mapObj: Record<Breakpts, V>,
  callback: (breakpt: Breakpts, mapValue: V) => T
) => {
  const map: Record<Breakpts, T | undefined> = {
    [Breakpts.desktopFallback]: undefined,
    [Breakpts.l]: undefined,
    [Breakpts.xl]: undefined,
    [Breakpts.xxl]: undefined
  }
  mapObject(mapObj, (breakpt, mapValue) => {
    map[breakpt] = callback(breakpt, mapValue)
  })
  return map as Record<Breakpts, T>
}

const getNoSizesError = (sizes: sizesJson, sizeType: string) =>
  new Error(`Breakpoint size has no ${sizeType} sizes: ${sizes[sizeType]}`)

const getBreakptConfig = (breakpt: Breakpts, sizes: BreakptSize[], debugOnly: boolean) => {
  sizes.map((size) => size[1] *= size[0].match(/^toolTips\//) ?
    TOOL_TIP_PERCENTAGE : MAIN_RESIZE_PERCENTAGE)
  return {
    breakpt,
    breakptWidth: BREAKPT_WIDTHS[breakpt],
    sizes,
    blur: breakpt === Breakpts.desktopFallback ? BLUR : undefined,
    exclude: breakpt === Breakpts.desktopFallback ? [MediaTypes.video] : undefined,
    debugOnly
  }
}

const getResizeCallback = (array: fileDataPair<dimension>[], rootPath: string) =>
  (fileName: string, size: dimensionType) => array
    .push([
      fileName.replace(new RegExp(`^${rootPath}/`), ''),
      [size.width, size.height]]
    )

const workFolder = SRC_WORK_PATH
const destination = joinPaths(ROOT_PATH, DESTINATION_ROOT)

const resize = async (config?: configType) => {
  const {
    resizeThumbnails,
    resizeWork,
    includePages,
    includeBreakpts
  } = { ...DEFAULT_CONFIG, ...config }

  const breakptWidths = includeBreakpts.length ? _.pick(BREAKPT_WIDTHS, includeBreakpts) : BREAKPT_WIDTHS
  const allBreakptSizes = createBreakptMap<sizesJson, number>(breakptWidths, breakpt =>
    readJsonSync(joinPaths(SIZE_PATH, `${breakpt}.json`)))

  const pageSizes: Record<string, breakptSizeCollection> = {}
  mapObject(allBreakptSizes, (breakpt, allSizes) => {
    const { work } = allSizes
    if (!work || Array.isArray(work)) throw getNoSizesError(allSizes, 'work')

    mapObject(work, (pageId, sizes) =>
      (pageSizes[pageId] ||= {} as breakptSizeCollection)[breakpt] = sizes)
  })

  const nativeDimensions: dimensionsJson = {}

  const thumbnailConfigs = createBreakptMap<BreakptConfig<Breakpts>, sizesJson>(
    allBreakptSizes, (breakpt, sizes) => {
      const { thumbnails } = sizes
      if (!thumbnails || !Array.isArray(thumbnails)) throw getNoSizesError(sizes, 'thumbnails')
      return getBreakptConfig(breakpt, [thumbnails[0]], !resizeThumbnails)
    }
  )
  const thumbnails: fileDataPair<dimension>[] = []
  await new Resizer<BreakptExports>(
    SRC_THUMBNAIL_PATH,
    Object.values(thumbnailConfigs),
    {
      destination: joinPaths(destination, THUMBNAIL_FOLDER),
      callback: getResizeCallback(thumbnails, SRC_THUMBNAIL_PATH)
    }
  ).init()
  nativeDimensions.thumbnails = thumbnails

  const work: fileDataCollection<dimension> = {}
  await mapObjectPromises(pageSizes, async (pageId, breakptSizes) => {
    const includePage = !includePages.length || includePages.includes(pageId)
    const debugOnly = !resizeWork || !includePage
    const pageConfigs = createBreakptMap<BreakptConfig<Breakpts>, fileDataPair<size>[]>(breakptSizes,
      (breakpt, sizes) => getBreakptConfig(breakpt, sizes, debugOnly))
    const maxConfig = {
      breakpt: MAX_FOLDER,
      sizes: pageConfigs.xxl.sizes,
      noResize: true,
      maxDimension: 2500 * 3000,
      exclude: [MediaTypes.poster],
      debugOnly
    }

    const workPage: fileDataPair<dimension>[] = []
    await new Resizer(
      joinPaths(workFolder, pageId),
      [...Object.values(pageConfigs), maxConfig],
      {
        destination: joinPaths(destination, WORK_FOLDER, pageId),
        callback: getResizeCallback(workPage, joinPaths(SRC_WORK_PATH, pageId))
      }
    ).init()
    work[pageId] = workPage
  })
  nativeDimensions.work = work

  fs.writeFileSync(NATIVE_DIMENSIONS_PATH, JSON.stringify(nativeDimensions))

}

export default resize