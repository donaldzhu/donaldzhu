import _ from 'lodash'
import toSpaceCase from 'to-space-case'
import Queue from '../queue'
import { ImgStack, VidStack } from './mediaStack'
import { capitalize, mapObject } from '../../commonUtils'
import { getBreakpointKey } from '../../queryUtil'
import { MEDIA_SIZES, MEDIA_TYPES, fileIsVid, isImg, isPoster, isVid } from './preloadUtils'
import nativeDimensions from '../../../data/media/nativeDimensions.json'
import workData from '../../../data/work/workData.json'

const LOG_COLORS = {
  [MEDIA_SIZES.desktopFallback]: 'yellow',
  [MEDIA_SIZES.full]: 'orange',
  [MEDIA_SIZES.original]: 'red',
}

class PreloadManager {
  constructor(canAutoPlay, loadVid) {
    this.thumbnails = {}
    this.workPages = {}

    this.mainQueue = new Queue(0)
    this.mainQueueName = undefined

    this.subqueues = []

    this.isComplete = false
    this.enabled = true
    this.verboseLevel = 0

    this.autoPlayConfig = { canAutoPlay }
    this.loadVid = loadVid

    if (this.enabled) {
      this._createThumbnailStacks()
      this._createWorkPageStacks()
    } else this.verboseLevel = 0

    if (this.verboseLevel >= 1)
      console.log(this)
  }

  _createThumbnailStacks() {
    this.thumbnails = nativeDimensions.thumbnails.map(([fileName, nativeDimension]) => {
      const pageId = fileName.replace(/\.[^/.]+$/, '')
      const { animatedThumbnail, listed, disabled } = workData.find(page => page.id === pageId)
      if (!listed || disabled) return
      const Stack = animatedThumbnail ? VidStack : ImgStack
      return new Stack({
        pageId,
        nativeDimension,
        mediaType: MEDIA_TYPES.thumbnails,
        fileName,
        autoPlayConfig: this.autoPlayConfig,
        loadVid: this.loadVid
      })
    }).filter(thumbnail => thumbnail)
  }

  // _createWorkPageStacks() {
  //   mapObject(_.cloneDeep(nativeDimensions), (pageId, pageSizes) => {
  //     this.workPages[pageId] =
  //       _.omit(pageSizes, [MEDIA_TYPES.thumbnails])
  //     mapObject(this.workPages[pageId], (mediaType, mediaSizes) => {
  //       const Stack = isVid(mediaType) ? VidStack : ImgStack
  //       mapObject(mediaSizes, (fileName, nativeDimension) =>
  //         mediaSizes[fileName] = new Stack({
  //           pageId,
  //           fileName,
  //           mediaType,
  //           nativeDimension,
  //           autoPlayConfig: this.autoPlayConfig,
  //           loadVid: this.loadVid
  //         })
  //       )
  //     })
  //   })
  // }


  _createWorkPageStacks() {
    // mapObject(nativeDimensions.work, (pageId, nativeDimensions) => {
    //   this.workPages[pageId] = nativeDimensions.map(([fileName, nativeDimensions]) => {
    //     const Stack = fileIsVid(fileName) ? VidStack : ImgStack
    //   })
    // })

    mapObject(_.cloneDeep(nativeDimensions), (pageId, pageSizes) => {
      this.workPages[pageId] =
        _.omit(pageSizes, [MEDIA_TYPES.thumbnails])
      mapObject(this.workPages[pageId], (mediaType, mediaSizes) => {
        const Stack = isVid(mediaType) ? VidStack : ImgStack
        mapObject(mediaSizes, (fileName, nativeDimension) =>
          mediaSizes[fileName] = new Stack({
            pageId,
            fileName,
            mediaType,
            nativeDimension,
            autoPlayConfig: this.autoPlayConfig,
            loadVid: this.loadVid
          })
        )
      })
    })
  }

  //-----primary preloaders-----//
  defaultPreload() {
    const allPagePreloaders = this._createPagePreloaders(size => ({
      run: () => this._preloadAllPageMedia(size),
      callback: this._logGroup('all pages', size)
    }))

    this._preloadMain('defaultPreload', [
      this._getPreloadThumbnails(),
      ...Object.values(allPagePreloaders)
    ])
  }

  pagePreload(pageId) {
    const pagePreloaders = this._createPagePreloaders((size) => ({
      run: () => this._preloadPageMedia(pageId, size),
      callback: this._logGroup(`current page (${pageId})`, size)
    }))

    const allPagePreloaders = this._createPagePreloaders((size) => ({
      run: () => this._preloadAllPageMedia(size, { exclude: pageId }),
      callback: this._logGroup('all other pages', size)
    }))

    this._preloadMain('pagePreload', [
      pagePreloaders.desktopFallback,
      pagePreloaders.full,
      this._getPreloadThumbnails(),
      pagePreloaders.original,
      ...Object.values(allPagePreloaders)
    ])
  }

  _preloadMain(preloaderName, queueFunctions) {
    if (!this.enabled || this.isComplete) return
    this.mainQueueName = preloaderName
    this.mainQueue.create(queueFunctions)
      .then(() => {
        this._onFinish()
        this._addToSubqueue({
          run: () => this._preloadRemainingVids(),
          callback: () => this._logFinished(true)
        })
      })
      .catch(() => this._logAborted(preloaderName))
  }

  _preloadRemainingVids() {
    if (!this.autoPlayConfig.canAutoPlay) return Promise.resolve()
    const type = MEDIA_TYPES.videos
    const getPreload = size => {
      const preloadFunctions = this.sortedPageIds
        .map(pageId => ({
          run: () => this._preloadMediaType(this.workPages[pageId][type], size),
          callback: this._log(3, type, size, pageId, true)
        }))

      return {
        run: () => this._addToSubqueue(preloadFunctions),
        callback: this._log(2, type, size, '*', true)
      }
    }

    return this._addToSubqueue([
      getPreload(MEDIA_SIZES.full),
      getPreload(MEDIA_SIZES.original)
    ])
  }

  _getPreloadThumbnails() {
    return {
      run: () => this._preloadThumbnails(),
      callback: this._logGroup('all thumbnails')
    }
  }

  //-----secondary preloaders-----//
  _preloadThumbnails() {
    const thumbnailStacks = Object.values(this.thumbnails)
    const [imgStacks, vidStacks] = _.partition(thumbnailStacks, stack =>
      isImg(stack.fileType))
    const getType = type => `thumbnail ${type}`
    const getPreload = (type, size) => ({
      run: () => this._preloadMediaType(isImg(type) ? imgStacks : vidStacks, size, isPoster(type)),
      callback: this._log(3, getType(type), size)
    })

    return this._addToSubqueue([
      getPreload(MEDIA_TYPES.images, MEDIA_SIZES.desktopFallback),
      getPreload(MEDIA_TYPES.posters, MEDIA_SIZES.desktopFallback),
      getPreload(MEDIA_TYPES.images, MEDIA_SIZES.full),
      getPreload(MEDIA_TYPES.posters, MEDIA_SIZES.full),
      getPreload(MEDIA_TYPES.videos, MEDIA_SIZES.full),
    ])
  }

  _preloadAllPageMedia(size, { exclude } = {}) {
    const getPreload = type => {
      const preloadFunctions =
        _.pull(this.sortedPageIds, exclude)
          .map(pageId => ({
            run: () => this._preloadMediaType(this.workPages[pageId][type], size),
            callback: this._log(3, type, size, pageId)
          }))

      return {
        run: () => this._addToSubqueue(preloadFunctions),
        callback: this._log(2, type, size, '*')
      }
    }

    return this._addToSubqueue([
      getPreload(MEDIA_TYPES.images),
      size !== MEDIA_SIZES.original && getPreload(MEDIA_TYPES.posters),
      getPreload(MEDIA_TYPES.toolTips),
      size !== MEDIA_SIZES.desktopFallback && getPreload(MEDIA_TYPES.videos)
    ])
  }

  _preloadPageMedia(pageId, size) {
    const mediaStacks = this.workPages[pageId]
    const mediaTypes = _.without(Object.keys(mediaStacks),
      size === MEDIA_SIZES.desktopFallback && MEDIA_TYPES.videos)

    const queueFunctions = mediaTypes.map(type => ({
      run: () => this._preloadMediaType(mediaStacks[type], size),
      callback: this._log(3, type, size, pageId)
    }))

    if (size !== MEDIA_SIZES.original)
      queueFunctions.push({
        run: () => this._preloadMediaType(mediaStacks.videos, size, true),
        callback: this._log(3, MEDIA_TYPES.posters, size, pageId)
      })

    return this._addToSubqueue(queueFunctions)
  }

  //-----preload helpers-----//
  _prefixPreload(size) {
    return `preload${capitalize(size)}`
  }

  /**
 * @returns {Promise}
 */
  _preloadMediaType(mediaTypeStacks, size, isPoster) {
    if (!mediaTypeStacks) return Promise.resolve()
    const preloadFunctionName = this._prefixPreload(size)
    const queueFunctions = Object.values(mediaTypeStacks)
      .map(stack => {
        const targetStack = isPoster ? stack.posterStack : stack
        return targetStack[preloadFunctionName].bind(targetStack)
      })

    return this._addToSubqueue(queueFunctions)
  }

  //-----queuers-----//
  _createPagePreloaders(callback) {
    return mapObject({ ...MEDIA_SIZES },
      (key, size, sizes) => sizes[key] = callback(size))
  }

  _addToSubqueue(queueFunctions, interval = 0) {
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
    this[this.mainQueueName]()
  }

  _onFinish() {
    this._logFinished(false)
    this.isComplete = true
  }

  //-----getters-----//
  get sortedPageIds() {
    return workData.map(page => page.id)
  }

  //-----loggers-----//
  _log(verboseLevel, type, size, pageId, isFullVid) {
    const messages = [`${toSpaceCase(type)}:`]
    const styles = ['color: white;']

    if (pageId) {
      let pageMessage, pageStyle
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
      this._decorateLog(messages, styles, size, isFullVid) :
      _.noop
  }

  _logGroup(groupName, size) {
    return this.verboseLevel >= 1 ? this._decorateLog(
      [` ${groupName.toLocaleUpperCase()} `],
      [`background: ${LOG_COLORS[size] || 'white'}; color: black; font-weight: bold;`],
      size
    ) : _.noop
  }

  _logFinished(isFullVid) {
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

  _logAborted(queueName) {
    if (this.verboseLevel >= 1) console.log(
      `%cAborted %c${queueName}%c.`,
      'color: gray; font-style: italic;',
      'color: white; font-style: italic;',
      'color: gray; font-style: italic;',
    )
  }

  _decorateLog(messages, styles, size, isFullVid) {
    const extraMessages = [
      ` ${size}${size === MEDIA_SIZES.full ?
        ` (${getBreakpointKey().toLocaleUpperCase()})` : ''}`,
      ` - ${isFullVid ? 'full vid ' : ''}preloaded!`
    ]
    const extraStyles = [
      `color: ${LOG_COLORS[size]};`,
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