import sharp from 'sharp'

export interface ResizerConfig {
  destination?: string
  mediaOptions?: MediaOptions
  toParentFolder?: boolean
  removeFilesAtDest?: boolean
  exportPoster?: boolean
  callback?: callbackType
}

export interface BreakptResizerConfig {
  destination: string
  mediaOptions: MediaOptions
  removeFilesAtDest: boolean
  exportPoster: boolean
}

export const enum ImgExtention {
  gif = 'gif',
  webp = 'webp',
  png = 'png'
}

export const enum VidExtension {
  webm = 'webm'
}

export const enum MediaType {
  image = 'image',
  video = 'video',
  poster = 'poster'
}

export interface MediaOptions {
  [ImgExtention.gif]?: sharp.GifOptions
  [ImgExtention.webp]?: sharp.WebpOptions
}

export interface BreakptConfig<K extends string> {
  breakpt: K
  breakptWidth?: number
  sizes: breakptSize[]
  noResize?: boolean
  maxDimension?: number
  blur?: number
  exclude?: MediaType[]
  debugOnly?: boolean
}

export type breakptSize = [string, number]

export interface BreakptResizeConfig {
  size: dimensionType
  fileName: string
  fileEntry: string
  isPoster?: boolean
  debugOnly?: boolean
}

export interface ResizePosterConfig {
  vidSize: dimensionType
  vidFileName: string
}

export interface dimensionType {
  width: number
  height: number
}

export type callbackType = (fileName: string, size: dimensionType) => void