import _, { extend } from 'lodash'
import toSpaceCase from 'to-space-case'
import Queue from '../queue'
import { ImgStack, VidStack } from './mediaStack'
import { capitalize, filterFalsy, loopObject, mapObject, partition, typedKeys, validateString } from '../../commonUtils'
import { getBreakptKey } from '../../queryUtil'
import { MediaSize, MediaType, VerboseLevel, isImg, fileIsImg, isImgSize } from './preloadUtils'
import nativeDimensions from '../../../data/media/nativeDimensions.json'
import workData from '../../../data/work/workData.json'
import { loadVidType } from './preloadTypes'
import { coorTuple, queueArgType, queueFunctionType } from '../../utilTypes'

const LOG_COLORS = {
  [MediaSize.DesktopFallback]: 'yellow',
  [MediaSize.Preview]: 'cyan',
  [MediaSize.Full]: 'orange',
  [MediaSize.Max]: 'red',
}

const enum MainQueue {
  DefaultPreload = 'defaultPreload',
  PagePreload = 'pagePreload'
}

class PreloadManager {
  thumbnails: (ImgStack | VidStack)[]
  workPages: Record<string, Partial<Record<MediaType, (ImgStack | VidStack)[]>>>
  mainQueue: Queue
  mainQueueName?: MainQueue
  mainQueuePageId?: string
  subqueues: Queue[]
  isComplete: boolean
  enabled: boolean
  verboseLevel: VerboseLevel
  autoPlayConfig: { canAutoPlay: boolean | undefined }
  loadVid: loadVidType

  constructor(canAutoPlay: boolean | undefined, loadVid: loadVidType) {
    this.thumbnails = []
    this.workPages = {}

    this.mainQueue = new Queue(0)
    this.mainQueueName = undefined
    this.mainQueuePageId = undefined

    this.subqueues = []

    this.isComplete = false
    this.enabled = true
    this.verboseLevel = VerboseLevel.Minimal

    this.autoPlayConfig = { canAutoPlay }
    this.loadVid = loadVid

    if (this.enabled) {
      this.createThumbnailStacks()
      this.createWorkPageStacks()
    } else this.verboseLevel = VerboseLevel.Quiet

    if (this.verboseLevel >= VerboseLevel.Normal)
      console.log(this)
  }

  private createThumbnailStacks() {
    const thumbnails = (nativeDimensions.thumbnails as [string, coorTuple][])
      .map(([fileName, nativeDimension]) => {
        const pageId = fileName.replace(/\.[^/.]+$/, '')
        const workPageData =
          workData.find(page => page.id === pageId)
        if (!workPageData) return
        const { animatedThumbnail, listed, enabled } = workPageData
        if (!listed || !enabled) return

        const Stack = animatedThumbnail ? VidStack : ImgStack
        return new Stack({
          pageId,
          nativeDimension,
          mediaType: MediaType.Thumbnails,
          fileName,
          autoPlayConfig: this.autoPlayConfig,
          loadVid: this.loadVid
        })
      })
    this.thumbnails = filterFalsy(thumbnails)
  }

  private createWorkPageStacks() {
    loopObject(nativeDimensions.work, (pageId, nativeDimensions) => {
      const workPage = this.workPages[pageId] = {} as Partial<Record<MediaType, (ImgStack | VidStack)[]>>;
      (nativeDimensions as [string, coorTuple][]).forEach(([fileName, nativeDimension]) => {
        const Stack = fileIsImg(fileName) ? ImgStack : VidStack
        const mediaType = fileName.match(/^toolTips\//) ? MediaType.ToolTips :
          fileIsImg(fileName) ? MediaType.Images : MediaType.Videos;
        (workPage[mediaType] ??= []).push(new Stack({
          pageId,
          fileName,
          mediaType,
          nativeDimension,
          autoPlayConfig: this.autoPlayConfig,
          loadVid: this.loadVid
        }))
      })
    })
  }

  //-----primary preloaders-----//
  defaultPreload() {
    const allPagePreloaders = this.createPagePreloaders((size: MediaSize) => ({
      run: () => this.preloadAllPageMedia(size),
      callback: this.logGroup('all pages', size)
    }))

    this.preloadMain(MainQueue.DefaultPreload, [
      this.getPreloadThumbnails(),
      ...Object.values(allPagePreloaders)
    ])
  }

  pagePreload(pageId?: string) {
    if (!pageId) return this.defaultPreload()
    const pagePreloaders = this.createPagePreloaders((size: MediaSize) => ({
      run: () => this.preloadPageMedia(pageId, size),
      callback: this.logGroup(`current page (${pageId})`, size)
    }))

    const allPagePreloaders = this.createPagePreloaders((size: MediaSize) => {
      if (!isImgSize(size)) return {
        run: () => this.preloadAllPageMedia(size, { exclude: pageId }),
        callback: this.logGroup('all other pages', size)
      }
    })

    this.mainQueuePageId = pageId
    this.preloadMain(MainQueue.PagePreload, [
      pagePreloaders.DesktopFallback,
      pagePreloaders.Preview,
      pagePreloaders.Full,
      this.getPreloadThumbnails(),
      pagePreloaders.Max,
      ...Object.values(allPagePreloaders)
    ])
  }

  private preloadMain<T>(preloaderName: MainQueue, queueFunctions: queueArgType<T>) {
    if (!this.enabled || this.isComplete) return
    this.mainQueueName = preloaderName
    this.mainQueue.create(queueFunctions)
      .then(() => {
        this.onFinish()
        this.addToSubqueue({
          run: () => this.preloadRemainingVids(),
          callback: () => this.logFinished(true)
        })
      })
      .catch(() => this.logAborted(preloaderName))
  }

  private preloadRemainingVids() {
    if (!this.autoPlayConfig.canAutoPlay) return Promise.resolve()
    const type = MediaType.Videos
    const getPreload = (size: MediaSize) => {
      const preloadFunctions = this.sortedPageIds
        .map(pageId => ({
          run: () => this.preloadMediaType(this.workPages[pageId][type], size),
          callback: this.log(3, type, size, pageId, true)
        }))

      return {
        run: () => this.addToSubqueue(preloadFunctions),
        callback: this.log(2, type, size, '*', true)
      }
    }

    return this.addToSubqueue([
      getPreload(MediaSize.Full),
      getPreload(MediaSize.Max)
    ])
  }

  private getPreloadThumbnails() {
    return {
      run: () => this.preloadThumbnails(),
      callback: this.logGroup('all thumbnails')
    }
  }

  //-----secondary preloaders-----//
  private preloadThumbnails() {
    const thumbnailStacks = Object.values(this.thumbnails)
    const [imgStacks, vidStacks] = partition<ImgStack, VidStack>(
      thumbnailStacks, stack => isImg(stack))
    const getType = (type: MediaType) => `thumbnail ${type}`
    const getPreload = (type: MediaType, size: MediaSize) => ({
      run: () => this.preloadMediaType(
        type === MediaType.Images ? imgStacks : vidStacks, size,
        type === MediaType.Posters
      ),
      callback: this.log(3, getType(type), size)
    })

    return this.addToSubqueue([
      getPreload(MediaType.Images, MediaSize.DesktopFallback),
      getPreload(MediaType.Posters, MediaSize.DesktopFallback),
      getPreload(MediaType.Images, MediaSize.Full),
      getPreload(MediaType.Posters, MediaSize.Full),
      getPreload(MediaType.Videos, MediaSize.Full),
    ])
  }

  private preloadAllPageMedia(size: MediaSize, { exclude }: { exclude?: string } = {}) {
    const getPreload = (type: MediaType) => {
      const pageIds = exclude ? _.pull(this.sortedPageIds, exclude) : this.sortedPageIds
      const preloadFunctions = pageIds.map(pageId => ({
        run: () => this.preloadMediaType(this.workPages[pageId][type], size),
        callback: this.log(3, type, size, pageId)
      }))

      return {
        run: () => this.addToSubqueue(preloadFunctions),
        callback: this.log(2, type, size, '*')
      }
    }

    return this.addToSubqueue([
      getPreload(MediaType.Images),
      size !== MediaSize.Max && getPreload(MediaType.Posters),
      getPreload(MediaType.ToolTips),
      !isImgSize(size) && getPreload(MediaType.Videos)
    ])
  }

  private preloadPageMedia(pageId: string, size: MediaSize) {
    const mediaStacks = this.workPages[pageId]
    const mediaStackKeys = typedKeys(mediaStacks)
    const mediaTypes = isImgSize(size) ? _.without(mediaStackKeys,
      MediaType.Videos) : mediaStackKeys

    const queueFunctions = mediaTypes.map(type => ({
      run: () => this.preloadMediaType(mediaStacks[type], size),
      callback: this.log(3, type, size, pageId)
    }))

    if (size !== MediaSize.Max)
      queueFunctions.push({
        run: () => this.preloadMediaType(mediaStacks.videos, size, true),
        callback: this.log(3, MediaType.Posters, size, pageId)
      })

    return this.addToSubqueue(queueFunctions)
  }

  //-----preload helpers-----//
  private prefixPreload<T extends MediaSize>(size: T): `preload${Capitalize<T>}` {
    return `preload${capitalize(size)}`
  }

  private preloadMediaType(
    mediaTypeStacks: (ImgStack | VidStack)[] | undefined,
    size: MediaSize,
    isPoster?: boolean
  ) {
    if (!mediaTypeStacks) return Promise.resolve()
    const preloadFunctionName = this.prefixPreload(size)
    const queueFunctions: (() => (Promise<void> | undefined))[] =
      mediaTypeStacks.map(stack => {
        const targetStack = isPoster && stack instanceof VidStack ? stack.posterStack : stack
        // Type-guarding redundancy
        if (targetStack instanceof ImgStack)
          return targetStack[preloadFunctionName].bind(targetStack)
        else if (preloadFunctionName === 'preloadFull' || preloadFunctionName === 'preloadMax')
          return targetStack[preloadFunctionName].bind(targetStack)
        return () => Promise.resolve()
      })

    return this.addToSubqueue(queueFunctions)
  }

  //-----queuers-----//
  private createPagePreloaders<T>(callback: (size: MediaSize) => queueFunctionType<T> | undefined) {
    return mapObject(MediaSize, (_, size) => callback(size))
  }

  private addToSubqueue<T = void>(queueFunctions: queueArgType<T>, interval = 0) {
    const queue = new Queue(interval)
    this.subqueues.push(queue)
    return queue.create(queueFunctions)
      .then(() => _.pull(this.subqueues, queue))
      .catch(_.noop)
  }

  abort() {
    if (!this.enabled) return
    this.mainQueue.abort()
    this.subqueues.forEach(queue => queue.abort())
    this.subqueues = []
  }

  restart() {
    if (!this.mainQueueName) return
    this.abort()
    this.isComplete = false
    this[this.mainQueueName](this.mainQueuePageId)
  }

  private onFinish() {
    this.logFinished(false)
    this.isComplete = true
  }

  //-----getters-----//
  get sortedPageIds() {
    return workData.map(page => page.id)
  }

  //-----loggers-----//
  private log(verboseLevel: VerboseLevel, type: string, size: MediaSize, pageId?: string, isFullVid?: boolean) {
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

    return verboseLevel <= this.verboseLevel ?
      this.decorateLog(messages, styles, size, isFullVid) :
      _.noop
  }

  private logGroup(groupName: string, size?: MediaSize) {
    return this.verboseLevel >= 1 ? this.decorateLog(
      [` ${groupName.toLocaleUpperCase()} `],
      [`background: ${size ? LOG_COLORS[size] : 'white'}; color: black; font-weight: bold;`],
      size
    ) : _.noop
  }

  private logFinished(isFullVid: boolean) {
    const { canAutoPlay } = this.autoPlayConfig
    const finishStyle = 'background: lime; color: black; font-weight: bold;'
    const finishType = isFullVid ? 'VIDEOS FULLY' : 'MEDIA'
    if (this.verboseLevel < 1) return
    if (!isFullVid || canAutoPlay)
      console.log(`%c ALL ${finishType} PRELOADED! `, finishStyle)
    if (!isFullVid && canAutoPlay) console.log(
      '%cSTART FULLY PRELOADING VIDEOS...',
      'color: gray; font-style: italic;')
  }

  private logAborted(queueName: string) {
    if (this.verboseLevel >= 1) console.log(
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


    return () => console.log(
      messages.map(msg => `%c${msg}`).join(''),
      ...styles
    )
  }
}

export default PreloadManager