import _ from 'lodash'
import { joinPaths, keysToObject, typedKeys } from '../../commonUtils'
import { ImgPreloader, VidPreloader } from './mediaPreloader'
import { MediaFileType } from './preloadUtils'
import type { coorTuple } from '../../utilTypes'
import type { MediaStackProps } from './preloaderTypes'

export class MediaStack<K extends string> {
  private listeners: (() => void)[]

  filePath: string
  fileName: string
  fileType: MediaFileType
  breakpts: K[]
  nativeDimension: coorTuple
  stack: Record<K, ImgPreloader | VidPreloader>

  constructor({
    fileName,
    fileType,
    filePath,
    breakpts,
    config,
    nativeDimension,
    loadVid,
  }: MediaStackProps<K> & {
    fileType: MediaFileType
  }) {
    this.fileName = fileName
    this.fileType = fileType
    this.nativeDimension = nativeDimension
    this.filePath = filePath
    this.breakpts = breakpts

    const Preloader = fileType === MediaFileType.Image ? ImgPreloader : VidPreloader
    this.stack = keysToObject<K, ImgPreloader | VidPreloader>(this.breakpts, size =>
      new Preloader(this.getPath(size), config, loadVid) as ImgPreloader | VidPreloader)
    this.listeners = []
  }

  private getPath(breakpt: K) {
    return joinPaths(this.filePath, breakpt, this.fileName)
  }

  preload(breakpt: K | undefined) {
    if (!breakpt) return Promise.resolve()
    return this.stack[breakpt].preload()
      .then(() => this.onFinished())
      .catch(err => {
        console.log(this)
        throw err
      })
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

  get loadedSizes() {
    return typedKeys(this.stack).filter(stackKey => {
      const media = this.stack[stackKey]
      return media.isLoaded
    })
  }
}


