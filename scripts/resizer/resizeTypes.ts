import { MAX_FOLDER } from './constants'
export const enum Breakpt {
  desktopFallback = 'desktopFallback',
  l = 'l',
  xl = 'xl',
  xxl = 'xxl',
}

export type BreakptExports = Breakpt | typeof MAX_FOLDER

export type size = number
export type dimension = [number, number]

export type fileDataPair<T> = [string, T]
export type FileDataCollection<T> = Record<string, fileDataPair<T>[]>
export type FileDataJson<T> = Record<string, fileDataPair<T>[] | FileDataCollection<T>>

export type BreakptSizeCollection = Record<Breakpt, fileDataPair<size>[]>
export type SizesJson = FileDataJson<size>
export type DimensionsJson = FileDataJson<dimension>

export interface ConfigType {
  resizeThumbnails: boolean
  resizeWork: boolean
  includePages: string[]
  includeBreakpts: Breakpt[]
}