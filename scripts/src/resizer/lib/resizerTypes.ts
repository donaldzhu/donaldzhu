import sharp from 'sharp'

export interface ResizerConfig {
  destination?: string
  mediaOptions?: MediaOptions
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

export enum ImgExtension {
  Gif = 'gif',
  Webp = 'webp',
  Png = 'png'
}

export enum VidExtension {
  Webm = 'webm',
  Mp4 = 'mp4'
}

export const imgExtensionRegex = Object.values(ImgExtension).join('|')
export const vidExtensionRegex = Object.values(VidExtension).join('|')

export const enum MediaType {
  Image = 'image',
  Video = 'video',
  Poster = 'poster'
}

export interface MediaOptions {
  [ImgExtension.Gif]?: sharp.GifOptions
  [ImgExtension.Webp]?: sharp.WebpOptions
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
  pageHeight?: number
}

export type callbackType = (fileName: string, size: dimensionType) => void