import { MediaTypes } from './lib/resizerTypes'
import { MAX_FOLDER } from './constants'
export const enum Breakpts {
  desktopFallback = 'desktopFallback',
  l = 'l',
  xl = 'xl',
  xxl = 'xxl',
}

export type BreakptExports = Breakpts | typeof MAX_FOLDER

export type size = number
export type dimension = [number, number]

export type fileDataPair<T> = [string, T]
export type fileDataCollection<T> = Record<string, fileDataPair<T>[]>
export type fileDataJson<T> = Record<string, fileDataPair<T>[] | fileDataCollection<T>>

export type breakptSizeCollection = Record<Breakpts, fileDataPair<size>[]>
export type sizesJson = fileDataJson<size>
export type dimensionsJson = fileDataJson<dimension>

export type configType = {
  resizeThumbnails: boolean,
  resizeWork: boolean,
  includePages: string[],
  includeBreakpts: Breakpts[]
}