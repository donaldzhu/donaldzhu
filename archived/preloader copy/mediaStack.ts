import _ from 'lodash'
import breakpts from '../../src/data/breakpoints'
import { joinPaths, keysToObject, typedKeys } from '../../src/utils/commonUtils'
import { getPreloadBreakpt } from '../../src/utils/queryUtil'
import { ImgPreloader, VidPreloader } from './preloader'
import {
  getPreviewBreakptKey,
  isImg,
  MediaFileType,
  MediaSize,
  MediaType
} from './preloadUtils'
import type { Breakpt } from '../../src/utils/queryUtil'
import type { coorTuple } from '../../src/utils/utilTypes'
import type { MediaStackProps, PreloadBreakpt } from './preloaderTypes'

export abstract class MediaStack {
  private mediaType: MediaType
  private listeners: (() => void)[]
  private stackKeys: PreloadBreakpt[]
  private breakpts: Breakpt[]

  pageId: string
  fileName: string
  fileType: MediaFileType
  nativeDimension: coorTuple
  stack: Record<PreloadBreakpt, ImgPreloader | VidPreloader>

  constructor({
    pageId,
    fileName,
    fileType,
    mediaType,
    autoPlayConfig,
    loadVid,
    preloaderType,
    nativeDimension
  }: MediaStackProps & {
    fileType: MediaFileType
    preloaderType: MediaFileType
  }) {
    this.pageId = pageId
    this.fileName = fileName
    this.fileType = fileType
    this.mediaType = mediaType
    this.nativeDimension = nativeDimension

    this.breakpts = typedKeys<Breakpt>(breakpts)
    this.stackKeys = this.breakpts

    if (isImg(this)) this.stackKeys.unshift(MediaSize.DesktopFallback)
    if (!this.isThumbnail) this.stackKeys.push(MediaSize.Max)

    const Preloader = preloaderType === MediaFileType.Image ? ImgPreloader : VidPreloader
    this.stack = keysToObject<PreloadBreakpt, ImgPreloader | VidPreloader>(this.stackKeys, size =>
      new Preloader(this.getPath(size), autoPlayConfig, loadVid) as ImgPreloader | VidPreloader)
    this.listeners = []
  }

  private getPath(size: PreloadBreakpt) {
    const rootPath = '/assets/desktop'
    const pagePath = joinPaths(rootPath, 'work', this.pageId, size)
    const thumbnailRootPath = [rootPath, MediaType.Thumbnails, size]

    let paths: string[]
    if (this.isThumbnail)
      paths = [...thumbnailRootPath, this.fileName]
    else paths = [pagePath, this.fileName]
    return joinPaths(...paths)
  }

  preloadFull() {
    const breakptKey = getPreloadBreakpt()
    return this.stack[breakptKey].preload()
      .then(() => this.onFinished())
      .catch(err => {
        console.log(this)
        throw err
      })
  }

  preloadMax() {
    return this.stack.max.preload()
      .then(() => this.onFinished())
  }

  onFinished() {
    this.listeners.forEach(listener => listener())
  }

  addLoadListener(callback: () => void) {
    this.listeners.push(callback)
  }

  removeLoadListener(callback: () => void) {
    _.pull(this.listeners, callback)
  }

  get isThumbnail() {
    return this.mediaType === MediaType.Thumbnails
  }

  get loadedSizes() {
    const loadedMedia: Partial<Record<PreloadBreakpt, ImgPreloader | VidPreloader>> =
      _.pickBy(this.stack, media => isImg(media) ?
        media.isLoaded : media.loadCount >= 1)
    return typedKeys(loadedMedia)
  }
}

export class ImgStack extends MediaStack {
  constructor(props: MediaStackProps) {
    super({
      ...props,
      fileType: MediaFileType.Image,
      preloaderType: MediaFileType.Image
    })
  }

  preloadDesktopFallback() {
    return this.stack.desktopFallback.preload()
      .then(() => this.onFinished())
  }

  preloadPreview() {
    const previewKey = getPreviewBreakptKey()
    if (!previewKey) return
    return this.stack[previewKey].preload()
      .then(() => this.onFinished())
  }
}

export class VidStack extends MediaStack {
  constructor(props: MediaStackProps) {
    super({
      ...props,
      fileType: MediaFileType.Video,
      preloaderType: MediaFileType.Video
    })
  }
}