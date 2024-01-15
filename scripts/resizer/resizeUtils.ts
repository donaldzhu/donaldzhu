import { joinPaths } from '../utils'
import { Device, THUMBNAIL_FOLDER, WORK_FOLDER } from './constants'
import { dimensionType } from './lib/resizerTypes'
import { SizesJson, dimension, fileDataPair } from './resizeTypes'

export const getNoSizesError = (sizes: SizesJson, sizeType: string) =>
  new Error(`Breakpoint size has no ${sizeType} sizes: ${sizes[sizeType]}`)


export const getResizeCallback = (array: fileDataPair<dimension>[], rootPath: string) =>
  (fileName: string, size: dimensionType) => array
    .push([
      fileName.replace(new RegExp(`^${rootPath}/`), ''),
      [size.width, size.height]]
    )

export const getPaths = (device: Device) => {
  const SRC_ROOT = 'public/assets-original'
  const DESTINATION_ROOT = 'public/assets'
  const SIZE_ROOT = 'scripts/resizer/sizes'
  const NATIVE_DIMENSIONS_ROOT = 'src/data/media/nativeDimensions'

  const SRC_PATH = joinPaths(SRC_ROOT, device)
  const DESTINATION_PATH = joinPaths(DESTINATION_ROOT, device)

  return {
    SRC_THUMBNAIL_PATH: joinPaths(SRC_PATH, THUMBNAIL_FOLDER),
    SRC_WORK_PATH: joinPaths(SRC_PATH, WORK_FOLDER),
    DESTINATION_THUMBNAIL_PATH: joinPaths(DESTINATION_PATH, THUMBNAIL_FOLDER),
    DESTINATION_WORK_PATH: joinPaths(DESTINATION_PATH, WORK_FOLDER),
    SIZE_PATH: joinPaths(SIZE_ROOT, device),
    NATIVE_DIMENSIONS_PATH: joinPaths(NATIVE_DIMENSIONS_ROOT, `${device}.json`)
  }

}