import { MediaFileType } from './preloadUtils'
import type { loadVidType } from './preloadTypes'

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
  private config: {
    canAutoPlay: boolean | undefined
  }
  private loadVid: loadVidType
  private threshold: number
  loadCount: number

  constructor(
    src: string,
    config: { canAutoPlay: boolean | undefined },
    loadVid: loadVidType
  ) {
    super(src, MediaFileType.Video)
    this.config = config
    this.loadVid = loadVid
    this.loadCount = 0
    this.threshold = 0.25
  }

  // TODO: kinda sucks and implementation dependent
  // will hopefully fix after switching to live streaming
  preload() {
    if (this.loadCount >= 2 || !this.config.canAutoPlay) return Promise.resolve()
    const result = this.loadVid(this.src, this.threshold)
      .then(() => {
        this.loadCount++
        this.threshold = 1
        this.isLoaded = true
      })
    return result
  }
}