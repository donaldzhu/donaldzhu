import path from 'path'
import { joinPaths } from '../utils'
import { Device, THUMBNAIL_FOLDER, WORK_FOLDER } from './constants'
import { Metadata } from './lib/resizerTypes'
import { SizesJson, dimension, fileDataPair } from './resizeTypes'

export const getNoSizesError = (sizes: SizesJson, sizeType: string) =>
  new Error(`Breakpoint size has no ${sizeType} sizes: ${sizes[sizeType]}`)

export const getResizeCallback = (array: fileDataPair<dimension>[], rootPath: string) =>
  (fileName: string, size: Metadata) => array.push([
    fileName.replace(new RegExp(`^${rootPath}/`), ''),
    [size.width, size.height]]
  )

export const getPaths = (device: Device) => {
  const SRC_ROOT = 'public/assets-original'
  const DESTINATION_ROOT = 'public/assets'
  const SIZE_ROOT = 'scripts/src/resizer/sizes'
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

export const replaceExt = (fileName: string, newExt: string) => {
  const ext = path.extname(fileName)
  const regex = new RegExp(`${ext}$`)
  return fileName.replace(regex, '.' + newExt)
}

export const roundEven = (number: number) => 2 * Math.round(number / 2)
export const isOdd = (number: number) => !!(number % 2)