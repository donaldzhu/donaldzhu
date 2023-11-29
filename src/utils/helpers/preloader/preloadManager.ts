import _ from 'lodash'
import toSpaceCase from 'to-space-case'
import desktopDimensions from '../../../data/media/nativeDimensions/desktop.json'
import mobileDimensions from '../../../data/media/nativeDimensions/mobile.json'
import workData from '../../../data/work/workData.json'
import { filterFalsy, joinPaths, loopObject, typedKeys, validateString } from '../../commonUtils'
import breakpts from '../../../data/breakpoints'
import { Device, getBreakptKey } from '../../queryUtil'
import { MediaStack } from './mediaStack'
import { MediaFileType, getPreviewBreakptKey, MediaSize, MediaType, fileIsImg, Verbosity } from './preloadUtils'
import PreloadQueuer from './preloadQueuer'
import type { MediaBreakpts, PreloadManagerConfig } from './preloaderTypes'
import type { coorTuple } from '../../utilTypes'
import type { loadVidType } from './preloadTypes'
import type { PreloadStack } from './preloadQueuer'

const LOG_COLORS = {
  [MediaSize.DesktopFallback]: 'yellow',
  [MediaSize.Preview]: 'cyan',
  [MediaSize.Full]: 'orange',
  [MediaSize.Max]: 'red',
}

export enum PreloadCategory {
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


class PreloadManager {
  private loadVid: loadVidType
  private verbosity: Verbosity

  config: PreloadManagerConfig
  enabled: boolean
  preloadManager: PreloadQueuer<PreloadManagerStack, MediaBreakpts>

  constructor(config: PreloadManagerConfig, loadVid: loadVidType) {
    this.config = config
    this.loadVid = loadVid
    this.verbosity = Verbosity.Diagnostic
    this.enabled = true
    this.preloadManager = new PreloadQueuer<PreloadManagerStack, MediaBreakpts>({
      queueInterval: 0
    })

    if (this.enabled) {
      this.createThumbnailStacks(Device.desktop)
      this.createWorkPagesStacks(Device.desktop)
      this.createThumbnailStacks(Device.mobile)
      this.createWorkPagesStacks(Device.mobile)
    } else this.verbosity = Verbosity.Quiet

    if (this.verbosity >= Verbosity.Normal) {
      console.log(`Breakpoint: ${getBreakptKey().toLocaleUpperCase()}`)
      console.log(this)
    }
  }

  private createThumbnailStacks(device: Device) {
    const nativeDimensions = (device === Device.desktop ?
      desktopDimensions : mobileDimensions).thumbnails as DimensionData
    nativeDimensions.map(([fileName, nativeDimension]) => {
      const pageId = fileName.replace(/\.[^/.]+$/, '')
      const { animatedThumbnail, listed, enabled } = workData.find(page => page.id === pageId) ?? {}
      if (!listed || !enabled) return

      this.preloadManager.stackData.push({
        stack: new MediaStack<MediaBreakpts>({
          fileName,
          filePath: joinPaths('assets', device, 'thumbnails'),
          fileType: animatedThumbnail ? MediaFileType.Video : MediaFileType.Image,
          breakpts: [...typedKeys(breakpts), MediaSize.DesktopFallback, MediaSize.Max],
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
    const nativeDimensions = (device === Device.desktop ?
      desktopDimensions : mobileDimensions).work
    loopObject(nativeDimensions, (pageId, nativeDimensions) => {
      (nativeDimensions as DimensionData).forEach(([fileName, nativeDimension]) =>
        this.preloadManager.stackData.push({
          stack: new MediaStack<MediaBreakpts>({
            fileName,
            fileType: fileIsImg(fileName) ? MediaFileType.Image : MediaFileType.Video,
            filePath: joinPaths('assets', device, 'work', pageId),
            breakpts: [...typedKeys(breakpts), MediaSize.DesktopFallback, MediaSize.Max],
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
    const preloadName = 'defaultPreload'
    this.logPreload(preloadName)
    this.preloadManager.createMainQueue([
      this.preloadThumbnails(),
      this.preloadAllPages(MediaSize.DesktopFallback),
      this.preloadAllPages(MediaSize.Preview),
      this.preloadAllPages(MediaSize.Full),
      this.preloadAllPages(MediaSize.Max),
    ]).then(() => {
      this.logFinished(false)
      this.preloadRemainingVid()
    }).catch(() =>
      this.logAborted(preloadName)
    )
  }

  pagePreload(pageIdToLoad: string) {
    const preloadName = 'pagePreload'
    this.logPreload(preloadName)
    const currentPageLogText = `current page (${pageIdToLoad})`
    this.preloadManager.createMainQueue([
      this.preloadPage(MediaSize.DesktopFallback, pageIdToLoad),
      this.preloadPage(MediaSize.Preview, pageIdToLoad),
      {
        run: this.preloadPage(MediaSize.Full, pageIdToLoad),
        callback: this.logGroup(currentPageLogText, MediaSize.Full)
      },
      this.preloadThumbnails(),
      {
        run: this.preloadPage(MediaSize.Max, pageIdToLoad),
        callback: this.logGroup(currentPageLogText, MediaSize.Max)
      },
      this.preloadAllPages(MediaSize.DesktopFallback, pageIdToLoad),
      this.preloadAllPages(MediaSize.Preview, pageIdToLoad),
      this.preloadAllPages(MediaSize.Full, pageIdToLoad),
      this.preloadAllPages(MediaSize.Max, pageIdToLoad),
    ]).then(() => {
      this.logFinished(false)
      this.preloadRemainingVid()
    }).catch(() =>
      this.logAborted(preloadName)
    )
  }

  restart() {
    this.preloadManager.restart()
  }

  abort() {
    this.preloadManager.abort()
  }

  private preloadAllPages(
    size: MediaSize | undefined,
    excludeId?: string | null,
    isFullVid?: boolean
  ) {
    if (!size) return () => Promise.resolve(false)
    const preloadType = (type: MediaType) => ({
      run: () => this.preloadManager.addToSubqueue(
        filterFalsy(_.pull(this.sortedPageIds, excludeId))
          .map(pageIdToLoad => this.preloadPageType(size, type, pageIdToLoad))
      ),
      callback: this.log(2, type, size, '*')
    })

    return {
      run: () => this.preloadManager.addToSubqueue(
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
    return () => this.preloadManager.addToSubqueue(
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
      run: () => this.preloadManager.preload(
        this.getMediaSizes(size),
        ({ category, pageId, mediaType, device }) =>
          category === PreloadCategory.WorkPage &&
          pageId === pageIdToLoad &&
          mediaType === type &&
          device === this.device),
      callback: this.log(3, type, size, pageIdToLoad)
    }
  }

  private getPreloadTypes(size: MediaSize, isFullVid = false) {
    const sizes: MediaType[] = []

    if (!isFullVid) sizes.push(
      MediaType.Images, MediaType.ToolTips
    )
    if (this.isVidSize(size)) sizes.push(
      MediaType.Videos
    )

    return sizes
  }

  private preloadRemainingVid() {
    if (!this.config.canAutoPlay) return () => Promise.resolve(false)
    return this.preloadManager.addToSubqueue([
      {
        run: () => this.preloadManager.addToSubqueue([
          this.preloadAllPages(MediaSize.Full, null, true),
          this.preloadAllPages(MediaSize.Max, null, true),
        ]),
        callback: () => this.logFinished(true)
      }
    ])
  }

  private preloadThumbnails() {
    const preloadThumbnailSize = (size: MediaSize, fileType: MediaFileType) => ({
      run: () => this.preloadManager.preload(this.getMediaSizes(size),
        ({ stack, category, device }) =>
          category === PreloadCategory.Thumbnail &&
          stack.fileType === fileType &&
          device === this.device),
      callback: this.log(3, `thumbnail ${fileType}`, size)
    })

    return {
      run: () => this.preloadManager.addToSubqueue([
        preloadThumbnailSize(MediaSize.DesktopFallback, MediaFileType.Image),
        preloadThumbnailSize(MediaSize.Full, MediaFileType.Image),
        preloadThumbnailSize(MediaSize.Full, MediaFileType.Video)
      ]),
      callback: this.logGroup('all thumbnails')
    }
  }

  private isVidSize(size: MediaSize | undefined) {
    return size !== MediaSize.DesktopFallback &&
      size !== MediaSize.Preview
  }

  // TODO: sort load order based on device
  get sortedPageIds() {
    return workData.map(page => page.id)
  }

  get device() {
    return this.config.isMobile ? Device.mobile : Device.desktop
  }

  private getMediaSizes(size: MediaSize): MediaBreakpts | undefined {
    const map = {
      [MediaSize.DesktopFallback]: MediaSize.DesktopFallback,
      [MediaSize.Preview]: getPreviewBreakptKey(),
      [MediaSize.Full]: getBreakptKey(),
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
      this.decorateLog(messages, styles, size, isFullVid) :
      _.noop
  }

  private logGroup(groupName: string, size?: MediaSize) {
    return this.verbosity >= 1 ? this.decorateLog(
      [` ${groupName.toLocaleUpperCase()} `],
      [`background: ${size ? LOG_COLORS[size] : 'white'}; color: black; font-weight: bold;`],
      size
    ) : _.noop
  }

  private logPreload(queueName: string) {
    if (this.verbosity >= 1) console.log(
      `Preloading: %c${queueName}`,
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

  private logAborted(queueName: string) {
    if (this.verbosity >= 1) console.log(
      `%cAborted %c${queueName}%c.`,
      'color: gray; font-style: italic;',
      'color: white; font-style: italic;',
      'color: gray; font-style: italic;',
    )
  }

  private decorateLog(messages: string[], styles: string[], size?: MediaSize, isFullVid?: boolean) {
    const extraMessages = [
      ` ${size}${size === MediaSize.Full ?
        ` (${getBreakptKey().toLocaleUpperCase()})` : ''}`,
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

    return (shouldLog?: boolean) => {
      if (shouldLog !== false)
        console.log(
          messages.map(msg => `%c${msg}`).join(''),
          ...styles,
        )
    }
  }
}

export default PreloadManager