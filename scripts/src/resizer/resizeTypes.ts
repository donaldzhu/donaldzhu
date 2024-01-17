import { MAX_FOLDER } from './constants'
export const enum Breakpt {
  DesktopFallback = 'desktopFallback',
  MobileFallback = 'mobileFallback',
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

export type DesktopBreakpts = Breakpt.DesktopFallback | Breakpt.L | Breakpt.Xl | Breakpt.Xxl
export type MobileBreakpts = Breakpt.S | Breakpt.M | Breakpt.L

export interface ConfigType<T extends Breakpt> {
  resizeThumbnails: boolean
  resizeWork: boolean
  includePages: string[]
  includeBreakpts: T[]
}