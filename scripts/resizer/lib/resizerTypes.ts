import sharp from 'sharp'

export type ResizerConfig = {
  destination?: string
  mediaOptions?: MediaOptions
  toParentFolder?: boolean
  removeFilesAtDest?: boolean
  exportPoster?: boolean
  callback?: callbackType
}

export type BreakptResizerConfig = {
  destination: string
  mediaOptions: MediaOptions
  removeFilesAtDest: boolean
  exportPoster: boolean
}

export const enum ImgExtentions {
  gif = 'gif',
  webp = 'webp',
  png = 'png'
}

export const enum VidExtensions {
  webm = 'webm'
}

export const enum MediaTypes {
  image = 'image',
  video = 'video',
  poster = 'poster'
}

export type MediaOptions = {
  [ImgExtentions.gif]?: sharp.GifOptions
  [ImgExtentions.webp]?: sharp.WebpOptions
}

export type BreakptConfig<K extends string> = {
  breakpt: K
  breakptWidth?: number
  sizes: BreakptSize[]
  noResize?: boolean
  maxDimension?: number
  blur?: number
  exclude?: MediaTypes[]
  debugOnly?: boolean
}

export type BreakptSize = [string, number]

export type BreakptResizeConfig = {
  size: dimensionType
  fileName: string
  fileEntry: string
  isPoster?: boolean
  debugOnly?: boolean
}

export type ResizePosterConfig = {
  vidSize: dimensionType,
  vidFileName: string
}

export type dimensionType = {
  width: number,
  height: number
}

export type callbackType = (fileName: string, size: dimensionType) => void