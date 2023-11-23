import { MediaFileType } from './preloadUtils'
import type { loadVidType } from './preloadTypes'

export abstract class MediaPreloader {
  src: string
  fileType: MediaFileType
  constructor(src: string, fileType: MediaFileType) {
    this.src = src
    this.fileType = fileType
  }
}

export class ImgPreloader extends MediaPreloader {
  private img: HTMLImageElement
  isLoaded: boolean
  constructor(src: string) {
    super(src, MediaFileType.Image)
    this.img = new Image()
    this.isLoaded = false
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
  private autoPlayConfig: {
    canAutoPlay: boolean | undefined
  }
  private loadVid: loadVidType
  private threshold: number
  loadCount: number

  constructor(
    src: string,
    autoPlayConfig: { canAutoPlay: boolean | undefined },
    loadVid: loadVidType
  ) {
    super(src, MediaFileType.Video)
    this.autoPlayConfig = autoPlayConfig
    this.loadVid = loadVid
    this.loadCount = 0
    this.threshold = 0.25
  }

  // TODO: kinda sucks and implementation dependent
  // will hopefully fix after switching to live streaming
  preload() {
    if (this.loadCount >= 2 || !this.autoPlayConfig.canAutoPlay) return Promise.resolve()
    return this.loadVid(this.src, this.threshold)
      .then(() => {
        this.loadCount++
        this.threshold = 1
      })
  }
}