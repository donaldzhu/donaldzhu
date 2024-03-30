import { MediaFileType } from './preloadUtils'

import type { loadNativeVidType } from './preloadTypes'
import type { PreloaderConfig } from './preloaderTypes'

abstract class MediaPreloader {
  src: string
  fileType: MediaFileType
  isLoaded: boolean
  constructor(src: string, fileType: MediaFileType) {
    this.src = src
    this.fileType = fileType
    this.isLoaded = false
  }
}

export class ImgPreloader extends MediaPreloader {
  private img: HTMLImageElement
  constructor(src: string) {
    super(src, MediaFileType.Image)
    this.img = new Image()
  }

  preload() {
    if (this.isLoaded) return Promise.resolve()
    const loadPromise = new Promise((resolve, reject) => {
      this.img.onload = () => resolve(this.isLoaded = true)
      this.img.onerror = () => reject(this)
    })
    this.img.src = this.src
    return loadPromise
  }
}

export class VidPreloader extends MediaPreloader {
  private threshold: number
  loadCount: number

  constructor(
    src: string,
    private config: PreloaderConfig,
    private loadNativeVid: loadNativeVidType
  ) {
    super(src, MediaFileType.Video)
    this.loadCount = 0
    this.threshold = config.isMobile ? 0.125 : 0.25
  }

  preload() {
    if (this.loadCount >= 2 || !this.config.canAutoPlay) return Promise.resolve()
    const result = this.loadNativeVid(this.src, this.threshold)
      .then(() => {
        this.loadCount++
        this.threshold = this.config.isMobile ? 0.25 : 0.5
        this.isLoaded = true
      })
    return result
  }
}