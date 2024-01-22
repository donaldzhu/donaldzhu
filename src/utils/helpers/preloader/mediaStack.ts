import _ from 'lodash'
import dashjs from 'dashjs'
import VidHelper from '../video/vidHelper'
import { joinPaths, keysToObject, typedKeys, validateString } from '../../commonUtils'
import { getBreakptKey } from '../../queryUtil'
import { ImgPreloader, VidPreloader } from './mediaPreloader'
import { MediaFileType, POSTER_SUBFOLDER, VidExt, getPosterFile, getPreviewBreakptKey } from './preloadUtils'
import type { Device } from '../../breakptTypes'
import type { coorTuple } from '../../utilTypes'
import type { MediaStackProps } from './preloaderTypes'

export class MediaStack<K extends string> {
  private listeners: (() => void)[]
  private canPlayWebm: boolean

  filePath: string
  fileName: string
  fileType: MediaFileType
  device: Device
  breakpts: K[]
  nativeDimension: coorTuple
  stack: Record<K, ImgPreloader | VidPreloader>
  posters: MediaStack<K> | undefined

  fallback: string
  dashPath: string | undefined
  dashLoaded: boolean

  constructor(props: MediaStackProps<K>) {
    const {
      fileName,
      filePath,
      fileType,
      device,
      breakpts,
      config,
      nativeDimension,
      loadNativeVid,
    } = props
    this.fileName = fileName
    this.filePath = filePath
    this.fileType = fileType
    this.device = device
    this.nativeDimension = nativeDimension
    this.breakpts = breakpts
    this.posters = this.isImg ? undefined :
      new MediaStack<K>({
        ...props,
        fileName: joinPaths(POSTER_SUBFOLDER, getPosterFile(fileName)),
        fileType: MediaFileType.Image,
      })

    this.fallback = joinPaths(
      this.filePath,
      getBreakptKey(this.device),
      this.fileName
    )

    this.dashPath = this.isImg ? undefined :
      joinPaths(this.filePath, 'dash', this.vidName, 'dash.mpd')
    this.canPlayWebm = config.canPlayWebm
    this.dashLoaded = false

    const Preloader = this.isImg ? ImgPreloader : VidPreloader
    this.stack = keysToObject<K, ImgPreloader | VidPreloader>(this.breakpts, size =>
      new Preloader(this.getPath(size), config, loadNativeVid) as ImgPreloader | VidPreloader)
    this.listeners = []
  }

  private getPath(breakpt: K) {
    return joinPaths(
      this.filePath,
      breakpt,
      validateString(!this.isImg, this.canPlayWebm ? VidExt.Webm : VidExt.Mp4),
      this.fileName
    )
  }

  private get vidName() {
    return this.isImg ? null : this.fileName.replace(/\.(mp4|webm)$/, '')
  }

  private get isImg() {
    return this.fileType === MediaFileType.Image
  }

  preload(breakpt: K | undefined, isPoster = false) {
    if (!breakpt) return Promise.resolve()
    if (!this.isImg && VidHelper.canUseDash && !isPoster) {
      if (breakpt === 'max') return Promise.resolve()
      else return this.preloadDash()
    }

    const stack = isPoster ? this.posters?.stack : this.stack
    if (!stack) return Promise.resolve()
    return stack[breakpt].preload()
      .then(() => this.onFinished())
      .catch(err => {
        console.log(this)
        throw err
      })
  }

  private preloadDash() {
    if (this.dashLoaded) return Promise.resolve()

    return new Promise<void>(resolve => {
      const player = dashjs.MediaPlayer().create()
      const dashThreshold = 4
      const vidEndTolerence = 0.5
      const bufferEvent = 'bufferLevelUpdated'
      player.updateSettings({
        streaming: {
          cacheInitSegments: true,
          buffer: {
            bufferTimeAtTopQuality: dashThreshold,
            bufferTimeAtTopQualityLongForm: dashThreshold,
            longFormContentDurationThreshold: 300,
          }
        }
      })

      const bufferListener = () => {
        const dashMetrics = player.getDashMetrics()
        const bufferLevel = dashMetrics.getCurrentBufferLevel('video')
        if (
          bufferLevel >= dashThreshold ||
          Math.abs(bufferLevel - player.duration()) <= vidEndTolerence
        ) onBuffered()
      }

      const onBuffered = () => {
        player.off(bufferEvent, bufferListener)
        setTimeout(player.destroy, 0)
        this.dashLoaded = true
        this.onFinished()
        resolve()
      }

      player.on(bufferEvent, bufferListener)
      player.initialize(document.createElement('video'), this.dashPath, false)
      player.preload()
    })
  }

  onFinished() {
    this.listeners.forEach(listener => listener())
  }

  addLoadListener(...callback: (() => void)[]) {
    this.listeners.push(...callback)
  }

  removeLoadListener(...callback: (() => void)[]) {
    _.pull(this.listeners, ...callback)
  }

  get loadedSizes() {
    return typedKeys(this.stack).filter(stackKey => {
      const media = this.stack[stackKey]
      return media.isLoaded
    })
  }

}
