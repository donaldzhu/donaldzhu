export class ImgPreloader {
  constructor(src) {
    this.src = src
    this.img = new Image()
    this.isLoaded = false
  }

  preload() {
    if (this.isLoaded) return Promise.resolve()
    const loadPromise = new Promise((resolve, reject) => {
      this.img.onload = () => resolve(this.isLoaded = true)
      this.img.onerror = err => reject(this.src, err)
    })
    this.img.src = this.src
    return loadPromise
  }
}

export class VidPreloader {
  constructor(src, autoPlayConfig, loadVid) {
    this.src = src
    this.autoPlayConfig = autoPlayConfig
    this.loadVid = loadVid
    this.loadCount = 0
    this.threshold = 0.25
  }

  preload() {
    if (this.loadCount >= 2 || !this.autoPlayConfig.canAutoPlay) return Promise.resolve()
    return this.loadVid(this.src, this.threshold)
      .then(() => {
        this.loadCount++
        this.threshold = 1
      })
  }

  get loadedPercentage() {
    return !this.totalBytes ? undefined : this.loadedBytes / this.totalBytes
  }
}