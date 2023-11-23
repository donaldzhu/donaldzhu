import { DesktopBreakpts, MAX_FOLDER, MobileBreakpts } from './constants'
export const enum Breakpt {
  DesktopFallback = 'desktopFallback',
  S = 's',
  M = 'm',
  L = 'l',
  Xl = 'xl',
  Xxl = 'xxl',
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

export interface ConfigType<T extends Breakpt> {
  resizeThumbnails: boolean
  resizeWork: boolean
  includePages: string[]
  includeBreakpts: T[]
}