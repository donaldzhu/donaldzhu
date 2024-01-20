import _ from 'lodash'
import dashjs from 'dashjs'
import Video from '../video/video'
import { joinPaths, keysToObject, typedKeys, validateString } from '../../commonUtils'
import { ImgPreloader, VidPreloader } from './mediaPreloader'
import { MediaFileType, VidExt, getPosterFile } from './preloadUtils'
import type { coorTuple } from '../../utilTypes'
import type { MediaStackProps } from './preloaderTypes'

export class MediaStack<K extends string> {
  private listeners: (() => void)[]
  private canPlayWebm: boolean
  private dashLoaded: boolean

  filePath: string
  fileName: string
  fileType: MediaFileType
  breakpts: K[]
  nativeDimension: coorTuple
  stack: Record<K, ImgPreloader | VidPreloader>
  posters: MediaStack<K> | undefined
  dashPath: string | undefined

  constructor(props: MediaStackProps<K> & {
    fileType: MediaFileType
  }) {
    const {
      fileName,
      fileType,
      filePath,
      breakpts,
      config,
      nativeDimension,
      loadNativeVid,
    } = props
    this.fileName = fileName
    this.fileType = fileType
    this.nativeDimension = nativeDimension
    this.filePath = filePath
    this.breakpts = breakpts
    this.posters = this.isImg ? undefined :
      new MediaStack<K>({
        ...props,
        fileName: joinPaths('posters', getPosterFile(fileName)),
        fileType: MediaFileType.Image,
      })
    this.dashPath = this.isImg ? undefined :
      joinPaths(this.filePath, 'dash', validateString(this.vidName), 'dash.mpd')
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
    if (!this.isImg && Video.canUseDash && !isPoster) {
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
