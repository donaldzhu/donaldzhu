import _ from 'lodash'
import toSpaceCase from 'to-space-case'
import desktopDimensions from '../../../data/media/nativeDimensions/desktop.json'
import mobileDimensions from '../../../data/media/nativeDimensions/mobile.json'
import workData from '../../../data/work/workData.json'
import { getDevice, filterFalsy, joinPaths, loopObject, typedKeys, validateString } from '../../commonUtils'
import breakpts from '../../../data/breakpoints'
import { getBreakptKey } from '../../queryUtil'
import { Device } from '../../breakptTypes'
import { MediaStack } from './mediaStack'
import { MediaFileType, getPreviewBreakptKey, MediaSize, MediaType, fileIsImg, Verbosity, Fallback } from './preloadUtils'
import PreloadQueuer, { type PreloadStack } from './preloadQueuer'
import type { MediaBreakpts, PreloaderConfig } from './preloaderTypes'
import type { coorTuple } from '../../utilTypes'
import type { loadVidType } from './preloadTypes'

const LOG_COLORS = {
  [MediaSize.Fallback]: 'yellow',
  [MediaSize.Preview]: 'cyan',
  [MediaSize.Full]: 'orange',
  [MediaSize.Max]: 'red',
}

enum PreloadCategory {
  Thumbnail = 'thumbnail',
  WorkPage = 'workPage'
}

interface PreloadManagerStack {
  category: PreloadCategory
  mediaType: MediaType.ToolTips | MediaType.Images | MediaType.Videos
  pageId?: string,
  device: Device
}

export type TypedPreloadStack = PreloadStack<PreloadManagerStack, MediaBreakpts>

type DimensionData = [string, coorTuple][]

enum PreloadName {
  Default = 'defaultPreload',
  Page = 'pagePreload'
}

interface DecorateLogConfig {
  isFullVid?: boolean
  shouldLogTime?: boolean
}

class PreloadManager {
  private loadVid: loadVidType
  private breakpts: MediaBreakpts[]
  private preloadQueuer: PreloadQueuer<PreloadManagerStack, MediaBreakpts>
  private currentPreloadName: PreloadName | undefined

  config: PreloaderConfig

  enabled: boolean
  loadLocal: boolean

  imgPreloaded: boolean
  verbosity: Verbosity
  currentStartTime: number
  logTime: boolean

  constructor(config: PreloaderConfig, loadVid: loadVidType) {
    this.config = config
    this.loadVid = loadVid

    this.verbosity = Verbosity.Minimal
    this.currentStartTime = Date.now()
    this.logTime = true

    this.enabled = true
    this.loadLocal = true
    this.preloadQueuer = new PreloadQueuer<PreloadManagerStack, MediaBreakpts>({
      queueInterval: 0
    })
    this.breakpts = [
      ...typedKeys(breakpts),
      Fallback.MobileFallback,
      Fallback.DesktopFallback,
      MediaSize.Max
    ]

    this.currentPreloadName = undefined
    this.imgPreloaded = false

    if (!this.enabled || process.env.NODE_ENV === 'production') {
      this.verbosity = Verbosity.Quiet
      this.logTime = false
    }

    if (process.env.NODE_ENV === 'production')
      this.loadLocal = false

    if (this.enabled) {
      this.createThumbnailStacks(Device.Desktop)
      this.createWorkPagesStacks(Device.Desktop)
      this.createThumbnailStacks(Device.Mobile)
      this.createWorkPagesStacks(Device.Mobile)
    }

    if (this.verbosity >= Verbosity.Normal) {
      console.log(
        `%cBreakpoint: %c${getBreakptKey(this.device).toLocaleUpperCase()}`,
        'color: white;',
        'color: ""'
      )
      console.log(
        `%cDevice: %c${this.device}`,
        'color: white;',
        'color: ""'
      )
      console.log(this)
    }
  }

  private createThumbnailStacks(device: Device) {
    const nativeDimensions = (device === Device.Desktop ?
      desktopDimensions : mobileDimensions).thumbnails as DimensionData
    nativeDimensions.map(([fileName, nativeDimension]) => {
      const pageId = fileName.replace(/\.[^/.]+$/, '')
      const { animatedThumbnail, listed, enabled } = workData.find(page => page.id === pageId) ?? {}
      if (!listed || !enabled) return

      this.preloadQueuer.stackData.push({
        stack: new MediaStack<MediaBreakpts>({
          fileName,
          filePath: joinPaths(this.assetPath, device, 'thumbnails'),
          fileType: animatedThumbnail ? MediaFileType.Video : MediaFileType.Image,
          breakpts: this.breakpts,
          config: this.config,
          nativeDimension,
          loadVid: this.loadVid
        }),
        device,
        category: PreloadCategory.Thumbnail,
        mediaType: animatedThumbnail ? MediaType.Images : MediaType.Videos,
      })
    })
  }

  private createWorkPagesStacks(device: Device) {
    const nativeDimensions = (device === Device.Desktop ?
      desktopDimensions : mobileDimensions).work
    loopObject(nativeDimensions, (pageId, nativeDimensions) => {
      (nativeDimensions as DimensionData).forEach(([fileName, nativeDimension]) =>
        this.preloadQueuer.stackData.push({
          stack: new MediaStack<MediaBreakpts>({
            fileName,
            fileType: fileIsImg(fileName) ? MediaFileType.Image : MediaFileType.Video,
            filePath: joinPaths(this.assetPath, device, 'work', pageId),
            breakpts: this.breakpts,
            config: this.config,
            nativeDimension,
            loadVid: this.loadVid
          }),
          device,
          category: PreloadCategory.WorkPage,
          mediaType: fileName.match(/^toolTips\//) ? MediaType.ToolTips :
            fileIsImg(fileName) ? MediaType.Images : MediaType.Videos,
          pageId
        }))
    })
  }

  defaultPreload() {
    this.currentPreloadName = PreloadName.Default
    this.logPreload()
    this.preloadQueuer.createMainQueue([
      this.preloadThumbnails(),
      this.preloadAllPages(MediaSize.Fallback),
      this.preloadAllPages(MediaSize.Preview),
      this.preloadAllPages(MediaSize.Full),
      this.config.isMobile ? undefined :
        this.preloadAllPages(MediaSize.Max),
    ]).then(() => {
      this.logFinished(false)
      this.currentPreloadName = undefined
      this.preloadRemainingVid()
    }).catch(() =>
      this.logAborted()
    )
  }

  pagePreload(pageIdToLoad: string) {
    this.currentPreloadName = PreloadName.Page
    this.logPreload()
    const currentPageLogText = `current page (${pageIdToLoad})`
    this.preloadQueuer.createMainQueue([
      this.preloadPage(MediaSize.Fallback, pageIdToLoad),
      {
        run: this.preloadPage(MediaSize.Preview, pageIdToLoad),
        callback: () => this.imgPreloaded = true
      },
      {
        run: this.preloadPage(MediaSize.Full, pageIdToLoad),
        callback: this.logGroup(currentPageLogText, MediaSize.Full)
      },
      this.preloadThumbnails(),
      this.config.isMobile ? undefined : {
        run: this.preloadPage(MediaSize.Max, pageIdToLoad),
        callback: this.logGroup(currentPageLogText, MediaSize.Max)
      },
      this.preloadAllPages(MediaSize.Fallback, pageIdToLoad),
      this.preloadAllPages(MediaSize.Preview, pageIdToLoad),
      this.preloadAllPages(MediaSize.Full, pageIdToLoad),
      this.config.isMobile ? undefined :
        this.preloadAllPages(MediaSize.Max, pageIdToLoad),
    ]).then(() => {
      this.logFinished(false)
      this.currentPreloadName = undefined
      this.preloadRemainingVid()
    }).catch(() =>
      this.logAborted()
    )
  }

  restart() {
    this.preloadQueuer.restart()
    this.cleanup()
  }

  abort() {
    this.preloadQueuer.abort()
    this.cleanup()
    this.currentPreloadName = undefined
  }

  cleanup() {
    if (!this.preloadQueuer.isComplete)
      this.imgPreloaded = false
  }

  private preloadAllPages(
    size: MediaSize | undefined,
    excludeId?: string | null,
    isFullVid?: boolean
  ) {
    if (!size)
      return () => Promise.resolve(false)
    const preloadType = (type: MediaType) => ({
      run: () => this.preloadQueuer.addToSubqueue(
        filterFalsy(_.pull(this.sortedPageIds, excludeId))
          .map(pageIdToLoad => this.preloadPageType(size, type, pageIdToLoad))
      ),
      callback: this.log(2, type, size, '*')
    })

    return {
      run: () => this.preloadQueuer.addToSubqueue(
        this.getPreloadTypes(size, isFullVid)
          .map(type => preloadType(type))
      ),
      callback: this.logGroup(excludeId ? 'all other pages' : 'all pages', size)
    }
  }

  private preloadPage(
    size: MediaSize | undefined,
    pageIdToLoad: string,
    isFullVid = false
  ) {
    if (!size) return () => Promise.resolve(false)
    return () => this.preloadQueuer.addToSubqueue(
      this.getPreloadTypes(size, isFullVid)
        .map(type => this.preloadPageType(size, type, pageIdToLoad))
    )
  }

  private preloadPageType(
    size: MediaSize,
    type: MediaType,
    pageIdToLoad: string
  ) {
    return {
      run: () => this.preloadQueuer.preload(
        this.getMediaSizes(size),
        type === MediaType.Poster,
        ({ category, pageId, mediaType, device }) =>
          category === PreloadCategory.WorkPage &&
          pageId === pageIdToLoad &&
          (mediaType === type || type === MediaType.Poster) &&
          device === this.device),
      callback: this.log(3, type, size, pageIdToLoad)
    }
  }

  private getPreloadTypes(size: MediaSize, isFullVid = false) {
    const sizes: MediaType[] = []

    if (!isFullVid) {
      sizes.push(MediaType.Images)

      if (size !== MediaSize.Max)
        sizes.push(MediaType.Poster)

      if (!this.config.isMobile)
        sizes.push(MediaType.ToolTips)
    }

    if (this.isVidSize(size))
      sizes.push(MediaType.Videos)

    return sizes
  }

  private preloadRemainingVid() {
    if (!this.config.canAutoPlay) return () => Promise.resolve(false)
    return this.preloadQueuer.addToSubqueue([
      {
        run: () => this.preloadQueuer.addToSubqueue([
          this.preloadAllPages(MediaSize.Full, null, true),
          this.preloadAllPages(MediaSize.Max, null, true),
        ]),
        callback: () => this.logFinished(true)
      }
    ])
  }

  private preloadThumbnails() {
    const filterThumbnail = (category: PreloadCategory, device: Device) =>
      category === PreloadCategory.Thumbnail &&
      device === this.device

    const preloadThumbnailSize = (size: MediaSize, fileType: MediaFileType) => ({
      run: () => this.preloadQueuer.preload(
        this.getMediaSizes(size),
        false,
        ({ stack, category, device }) =>
          stack.fileType === fileType &&
          filterThumbnail(category, device)
      ),
      callback: this.log(3, `thumbnail ${fileType}`, size)
    })

    const preloadPoster = (size: MediaSize) => ({
      run: () => this.preloadQueuer.preload(
        this.getMediaSizes(size),
        true,
        ({ category, device }) => filterThumbnail(category, device)
      ),
      callback: this.log(3, 'thumbnail posters', size)
    })

    return {
      run: () => this.preloadQueuer.addToSubqueue([
        preloadThumbnailSize(MediaSize.Fallback, MediaFileType.Image),
        preloadPoster(MediaSize.Fallback),
        preloadThumbnailSize(MediaSize.Full, MediaFileType.Image),
        {
          run: () => this.preloadQueuer.addToSubqueue([
            preloadPoster(MediaSize.Full)
          ]),
          callback: () => {
            if (this.currentPreloadName === PreloadName.Default)
              this.imgPreloaded = true
          }
        },
        preloadThumbnailSize(MediaSize.Full, MediaFileType.Video)
      ]),
      callback: this.logGroup('all thumbnails')
    }
  }

  private isVidSize(size: MediaSize | undefined) {
    return size !== MediaSize.Fallback &&
      size !== MediaSize.Preview
  }

  get sortedPageIds() {
    return workData
      .sort((pageA, pageB) =>
        (pageA.order[this.device] ?? 0) -
        (pageB.order[this.device] ?? 0))
      .map(page => page.id)
  }

  get device() {
    return getDevice(this.config.isMobile)
  }

  get assetPath() {
    // const storageRoot= 'https://storage.googleapis.com/donaldzhu-portfolio/'
    // const storageRoot = 'https://donaldzhu-portfolio-us-east.s3.us-east-2.amazonaws.com/'
    const storageRoot = 'https://raw.githubusercontent.com/donaldzhu/portfolio-static-files/main/'
    return validateString(!this.loadLocal, storageRoot) + 'assets'
  }

  private getMediaSizes(size: MediaSize): MediaBreakpts | undefined {
    const map = {
      [MediaSize.Fallback]: this.config.isMobile ?
        Fallback.MobileFallback : Fallback.DesktopFallback,
      [MediaSize.Preview]: getPreviewBreakptKey(this.device),
      [MediaSize.Full]: getBreakptKey(this.device),
      [MediaSize.Max]: MediaSize.Max
    } as const
    return map[size]
  }

  private log(
    verboseLevel: Verbosity,
    type: string,
    size: MediaSize,
    pageId?: string,
    isFullVid?: boolean
  ) {
    const messages = [`${toSpaceCase(type)}:`]
    const styles = ['color: white;']

    if (pageId) {
      let pageMessage: string, pageStyle: string
      if (pageId === '*') {
        pageMessage = 'ALL PAGES'
        pageStyle = `text-transform: italic; color: ${LOG_COLORS[size]};`
      } else {
        pageMessage = pageId
        pageStyle = ''
      }
      messages.unshift(`[ ${pageMessage} ] `)
      styles.unshift(pageStyle)
    }

    return verboseLevel <= this.verbosity ?
      this.decorateLog(messages, styles, size, { isFullVid }) :
      _.noop
  }

  private logGroup(groupName: string, size?: MediaSize) {
    return this.verbosity >= 1 ? this.decorateLog(
      [` ${groupName.toLocaleUpperCase()} `],
      [`background: ${size ? LOG_COLORS[size] : 'white'}; color: black; font-weight: bold;`],
      size,
      { shouldLogTime: true }
    ) : _.noop
  }

  private logPreload() {
    if (this.verbosity >= 1) console.log(
      `Preloading: %c${this.currentPreloadName}`,
      'color: white; font-style: italic;',
    )
  }

  private logFinished(isFullVid: boolean) {
    const { canAutoPlay } = this.config
    const finishStyle = 'background: lime; color: black; font-weight: bold;'
    const finishType = isFullVid ? 'VIDEOS FULLY' : 'MEDIA'
    if (this.verbosity < 1) return
    if (!isFullVid || canAutoPlay)
      console.log(`%c ALL ${finishType} PRELOADED! `, finishStyle)
    if (!isFullVid && canAutoPlay) console.log(
      '%cSTART FULLY PRELOADING VIDEOS...',
      'color: gray; font-style: italic;')
  }

  private logAborted() {
    if (this.verbosity >= 1) console.log(
      `%cAborted %c${this.currentPreloadName}%c.`,
      'color: gray; font-style: italic;',
      'color: white; font-style: italic;',
      'color: gray; font-style: italic;',
    )
  }

  private decorateLog(
    messages: string[],
    styles: string[],
    size?: MediaSize,
    config?: DecorateLogConfig
  ) {
    const { isFullVid, shouldLogTime } = config ?? {}

    const extraMessages = [
      ` ${size}${size === MediaSize.Full ?
        ` (${getBreakptKey(this.device).toLocaleUpperCase()})` : ''}`,
      ` - ${validateString(isFullVid, 'full vid ')}preloaded!`
    ]

    const extraStyles = [
      `color: ${size ? LOG_COLORS[size] : ''};`,
      'color: gray; font-style: italic;'
    ]

    if (!size) {
      extraMessages.shift()
      extraStyles.shift()
    }

    messages.push(...extraMessages)
    styles.push(...extraStyles)

    if (isFullVid)
      styles = styles.map(style => style + 'font-style: italic;')

    this.currentStartTime = Date.now()
    return (shouldLog?: boolean) => {
      if (shouldLogTime && this.logTime) {
        messages.push(` ${(Date.now() - this.currentStartTime) / 1000}s`)
        styles.push('color: white; font-style: normal;')
      }

      if (shouldLog !== false)
        console.log(
          messages.map(msg => `%c${msg}`).join(''),
          ...styles,
        )
    }
  }

  findStack(searchFunction:
    (stackData: TypedPreloadStack) => boolean
  ) {
    return this.preloadQueuer.stackData.find(searchFunction)
  }

  findThumbnail(pageId: string) {
    return this.findStack(stackData =>
      (stackData.stack.fileName.match(/^.*(?=\.)/) ?? [])[0] === pageId &&
      stackData.device === this.device &&
      stackData.category === PreloadCategory.Thumbnail
    )
  }

  findWorkMedia(pageId: string, fileName: string) {
    return this.findStack(stackData =>
      stackData.stack.fileName === fileName &&
      stackData.pageId === pageId &&
      stackData.device === this.device
    )
  }
}

export default PreloadManager