import fs from 'fs'
import _ from 'lodash'
import Resizer from './lib/resizer'
import { MediaType, dimensionType } from './lib/resizerTypes'
import { joinPaths, loopObject, mapObject, mapObjectPromises, readJsonSync } from '../utils'
import { BreakptExports, Breakpt, BreakptSizeCollection, SizesJson, fileDataPair, DimensionsJson, dimension, FileDataCollection, ConfigType } from './resizeTypes'
import { BREAKPT_WIDTHS, MAX_FOLDER, THUMBNAIL_FOLDER, WORK_FOLDER, DEFAULT_CONFIG, SRC_WORK_PATH, SRC_THUMBNAIL_PATH, MobileBreakpts, ROOT_PATH } from './constants'

const getNoSizesError = (sizes: SizesJson, sizeType: string) =>
  new Error(`Breakpoint size has no ${sizeType} sizes: ${sizes[sizeType]}`)

const getResizeCallback = (array: fileDataPair<dimension>[], rootPath: string) =>
  (fileName: string, size: dimensionType) => array
    .push([
      fileName.replace(new RegExp(`^${rootPath}/`), ''),
      [size.width, size.height]]
    )

const workFolder = 'asset-original/mobile/work'
const destination = 'public/assets/mobile'

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
  const breakptSizes: SizesJson = readJsonSync('scripts/resizer/sizes/mobile/all.json')

  const pageSizes: Record<string, BreakptSizeCollection> = {}
  loopObject(breakptWidths, (breakpt) => {
    const { work } = breakptSizes
    if (!work || Array.isArray(work)) throw getNoSizesError(breakptSizes, 'work')
    loopObject(work, (pageId, sizes) =>
      (pageSizes[pageId] ||= {} as BreakptSizeCollection)[breakpt] = sizes)
  })

  const nativeDimensions: DimensionsJson = {}

  const thumbnailConfigs = mapObject(
    breakptWidths, breakpt => {
      const { thumbnails } = breakptSizes
      if (!thumbnails || !Array.isArray(thumbnails)) throw getNoSizesError(breakptSizes, 'thumbnails')
      return {
        breakpt,
        breakptWidth: BREAKPT_WIDTHS[breakpt],
        sizes: [thumbnails[0]],
        debugOnly: !resizeThumbnails
      }
    }
  )

  const thumbnails: fileDataPair<dimension>[] = []
  await new Resizer<BreakptExports>(
    'asset-original/mobile/thumbnails',
    Object.values(thumbnailConfigs),
    {
      destination: joinPaths(destination, THUMBNAIL_FOLDER),
      callback: getResizeCallback(thumbnails, 'asset-original/mobile/thumbnails')
    }
  ).init()
  nativeDimensions.thumbnails = thumbnails

  const work: FileDataCollection<dimension> = {}
  await mapObjectPromises(pageSizes, async (pageId, breakptSizes) => {
    const includePage = !includePages.length || includePages.includes(pageId)
    const debugOnly = !resizeWork || !includePage
    const pageConfigs = mapObject(breakptSizes,
      (breakpt, sizes) => ({
        breakpt,
        breakptWidth: BREAKPT_WIDTHS[breakpt],
        sizes,
        debugOnly
      }))

    const maxConfig = {
      breakpt: MAX_FOLDER,
      sizes: pageConfigs.l.sizes,
      noResize: true,
      maxDimension: 1500 * 2000,
      exclude: [MediaType.Poster], // TODO
      debugOnly
    }

    const workPage: fileDataPair<dimension>[] = []
    await new Resizer(
      joinPaths(workFolder, pageId),
      [...Object.values(pageConfigs), maxConfig],
      {
        destination: joinPaths(destination, WORK_FOLDER, pageId),
        callback: getResizeCallback(workPage, joinPaths(workFolder, pageId))
      }
    ).init()
    work[pageId] = workPage
  })
  nativeDimensions.work = work

  fs.writeFileSync('src/data/media/nativeDimensions/mobile.json', JSON.stringify(nativeDimensions))

}

export default resizeMobile