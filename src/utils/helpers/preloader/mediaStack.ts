import _ from 'lodash'
import { ImgPreloader, VidPreloader } from './preloader'
import { joinPaths, keysToObject, typedKeys } from '../../commonUtils'
import { Breakpt, getBreakptKey } from '../../queryUtil'
import { FileExt, MediaSize, MediaType, MediaFileType, getPreviewBreakptKey, isThumbnail, _isImg } from './preloadUtils'
import breakpts from '../../../data/breakpoints'
import { coorTuple } from '../../utilTypes'
import { MediaStackProps, PreloadBreakpt } from './preloaderTypes'

export class MediaStack {
  pageId: string
  fileName: string
  fileType: MediaFileType
  mediaType: MediaType
  isPoster: boolean
  nativeDimension: coorTuple

  breakpts: Breakpt[]
  stackKeys: PreloadBreakpt[]
  stack: Record<PreloadBreakpt, ImgPreloader | VidPreloader>
  listeners: (() => void)[]

  constructor({
    pageId,
    fileName,
    fileType,
    mediaType,
    isPoster,
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
    this.isPoster = !!isPoster
    this.nativeDimension = nativeDimension

    this.breakpts = typedKeys<Breakpt>(breakpts)
    this.stackKeys = this.breakpts

    if (_isImg(this)) this.stackKeys.unshift(MediaSize.DesktopFallback)
    if (!this.isThumbnail) this.stackKeys.push(MediaSize.Max)

    const Preloader = preloaderType === MediaFileType.Image ? ImgPreloader : VidPreloader
    this.stack = keysToObject<PreloadBreakpt, ImgPreloader | VidPreloader>(this.stackKeys, size =>
      new Preloader(this.getPath(size), autoPlayConfig, loadVid) as ImgPreloader | VidPreloader)
    this.listeners = []
  }

  private getPath(size: PreloadBreakpt) {
    const rootPath = '/assets'
    const pagePath = joinPaths(rootPath, 'work', this.pageId, size)
    const thumbnailRootPath = [rootPath, MediaType.Thumbnails, size]

    let paths: string[]
    if (this.isThumbnail)
      paths = !this.isPoster ?
        [...thumbnailRootPath, this.fileName] :
        [...thumbnailRootPath, MediaType.Posters, this.fileName]
    else if (this.isPoster)
      paths = [pagePath, MediaType.Posters, this.fileName]
    else paths = [pagePath, this.fileName]
    return joinPaths(...paths)
  }

  preloadFull() {
    const breakptKey = getBreakptKey()
    return this.stack[breakptKey].preload()
      .then(() => this.onFinished())
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
    return isThumbnail(this.mediaType)
  }

  get loadedSizes() {
    const loadedMedia = _.pickBy(this.stack,
      media => _isImg(media) ?
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
  posterStack: ImgStack
  constructor(props: MediaStackProps) {
    super({
      ...props,
      fileType: MediaFileType.Image,
      preloaderType: MediaFileType.Video
    })

    this.posterStack = new ImgStack({
      ...props,
      fileName: this.isThumbnail ? `${this.pageId}.webp` :
        this.fileName.replace(FileExt.Webm, FileExt.Webp),
      mediaType: this.isThumbnail ? MediaType.Thumbnails : MediaType.Images,
      isPoster: true
    })
  }
}