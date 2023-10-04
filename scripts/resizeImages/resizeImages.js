const fs = require('fs/promises')
const _ = require('lodash')
const chalk = require('chalk')
const sharp = require('sharp')
const { THUMBNAIL_ROOT_PATH, THUMBNAIL_KEY, LOG_COLORS, TOOL_TIP_SIZE, MAIN_CONTAINER_SIZE, MEDIA_ENLARGEMNET_FACTOR, DESKTOP_FALLBACK_BREAKPOINT, SKIP_IMG, SKIP_VIDEO, TOOL_TIP_SUBFOLDER, MEDIA_TYPES, POSTER_SUBPATH, EXCLUDE_SIZES, ONLY_PAGES, MEDIA_SIZES, THUMBNAIL_ORIGINAL_POSTER_PATH, FILE_EXT } = require('./config')
const ffmpeg = require('fluent-ffmpeg')
const { emptyDir, mapObject } = require('../utils')
let breakpoints = require('../../src/data/breakpoints.json')
const workData = require('../../src/data/work/workData.json')

const nativeSizes = {}
const imgObjects = {}
const vidObjects = {}

const joinPaths = (...paths) => paths.filter(p => p).join('/')

const resizeImages = async () => {
  breakpoints = { [DESKTOP_FALLBACK_BREAKPOINT]: 500, ...breakpoints }
  await emptyDir(joinPaths(THUMBNAIL_ROOT_PATH, MEDIA_SIZES.original, POSTER_SUBPATH))
  await mapObject(_.omit(breakpoints, EXCLUDE_SIZES), async (breakpoint, breakpointSize) => {
    const bp = new Breakpoint(breakpoint, breakpointSize)
    return await bp.map()
  })
  await fs.writeFile('src/data/media/nativeSizes.json', JSON.stringify(nativeSizes))
}

class Breakpoint {
  constructor(breakpoint, breakpointSize) {
    this.breakpoint = breakpoint
    this.breakpointSize = breakpointSize
    this.sizes = undefined
  }

  async map() {
    this.sizes = JSON.parse(await fs.readFile(`scripts/sizes/${this.breakpoint}.json`, 'utf8'))
    let pageSizes = _.omit(this.sizes, THUMBNAIL_KEY)
    if (ONLY_PAGES.length) pageSizes = _.pick(pageSizes, ONLY_PAGES)

    const breakpointThumbPath = joinPaths(THUMBNAIL_ROOT_PATH, this.breakpoint)
    await emptyDir(breakpointThumbPath)
    await emptyDir(joinPaths(breakpointThumbPath, POSTER_SUBPATH))
    await mapObject(pageSizes, async pageId =>
      await (new PageBreakpoint(
        pageId,
        this.breakpoint,
        this.breakpointSize,
        this.sizes
      )).map())
  }
}

class PageBreakpoint {
  constructor(id, breakpoint, breakpointSize, breakpointMediaSizes) {
    this.id = id
    this.breakpointMediaSizes = breakpointMediaSizes
    this.mediaSizes = breakpointMediaSizes[id]

    this.breakpoint = breakpoint
    this.breakpointSize = breakpointSize

    this.nativeSizes = nativeSizes[id] ??= {}
    this.workData = workData.find(page => page.id === id)
    this.pageRootPath = joinPaths('public/assets/work', id)
    this.breakpointPath = joinPaths(this.pageRootPath, this.breakpoint)
    this.originalPosterPath = joinPaths(this.pageRootPath, MEDIA_SIZES.original, POSTER_SUBPATH)
  }

  async map() {
    const { images, imageGroups, videos, toolTips } = this.mediaSizes

    await emptyDir(this.breakpointPath)
    if (this.workData.listed) await this.resizeThumb()
    if (images) await this.resizeImgs(images, MEDIA_TYPES.images)
    if (toolTips) {
      await emptyDir(joinPaths(this.breakpointPath, TOOL_TIP_SUBFOLDER))
      await this.resizeImgs(toolTips, MEDIA_TYPES.toolTips, TOOL_TIP_SUBFOLDER)
    }
    if (imageGroups) this.resizeImgGroups(imageGroups)
    if (videos) {
      if (this.isFallback) await emptyDir(this.originalPosterPath)
      await emptyDir(joinPaths(this.pageRootPath, this.breakpoint, POSTER_SUBPATH))
      await mapObject(videos, async (filename, size) => {
        await this.resizeMedia({
          filename, isImage: false, size
        })
        await this.resizeMedia({
          filename: filename.replace('.webm', '.webp'),
          isImage: true,
          type: MEDIA_TYPES.posters,
          subfolder: POSTER_SUBPATH,
          size
        })
      })
    }

    if (!SKIP_IMG || !SKIP_VIDEO) this.log('all media resized!', true)
  }

  async resizeMedia({
    filename,
    isImage,
    type,
    subfolder,
    size
  }) {
    const rootPath = (this.isThumb(type) || this.isThumbPoster(type)) ? THUMBNAIL_ROOT_PATH : this.pageRootPath
    const subpath = joinPaths(subfolder, filename)
    const source = joinPaths(rootPath, MEDIA_SIZES.original, subpath)
    const destination = joinPaths(rootPath, this.breakpoint, subpath)
    const resizedWidth = this.getWidth(size, this.isToolTip(type) ?
      TOOL_TIP_SIZE : MAIN_CONTAINER_SIZE)
    const config = {
      filename,
      subpath,
      type,
      source,
      destination,
      resizedWidth
    }
    await (isImage ? this.resizeImg(config) : this.resizeVid(config))
  }

  async resizeImg({
    filename,
    subpath,
    type = MEDIA_TYPES.images,
    source,
    destination,
    resizedWidth,
  }) {
    let sharpImg = imgObjects[source] ??= await sharp(source)
    sharpImg = await sharpImg.clone()

    const { width, height } = await sharpImg.metadata()
    const dimensions = [width, height]
    if (this.isImgGroup(type))
      this.saveDimensions(subpath, MEDIA_TYPES.images, dimensions)
    else if (
      !this.isPoster(type) &&
      !this.isThumbPoster(type)
    ) this.saveDimensions(filename, type, dimensions)

    if (SKIP_IMG) return

    if (width > resizedWidth) await sharpImg
      .resize({
        width: resizedWidth,
        height: Math.round(height / width * resizedWidth)
      })
      .webp({ quality: 60, effort: 1 })

    if (this.isFallback) await sharpImg.blur()
    await sharpImg.toFile(destination)
  }

  async resizeImgs(imgSizes, type, subfolder = '') {
    await mapObject(imgSizes, async (filename, size) =>
      await this.resizeMedia({
        filename,
        isImage: true,
        type,
        subfolder,
        size
      }))
  }

  async resizeVid({
    filename,
    type = MEDIA_TYPES.videos,
    source,
    destination,
    resizedWidth
  }) {
    const promisifiyResize = () => new Promise(resolve => {
      let { vid, width } = vidObjects[source]
      if (width > resizedWidth)
        vid = vid
          .clone()
          .size(`${resizedWidth}x?`)
      vid.on('end', () => {
        if (!this.isThumb(type))
          this.log(`resized video ${filename}!`, false)
        resolve()
      }).save(destination)
    })
    if (!SKIP_VIDEO && vidObjects[source]) return await promisifiyResize()

    const vidObject = vidObjects[source] = {}
    const vid = vidObject.vid = ffmpeg(source)
    return await new Promise(resolve =>
      vid.ffprobe(async (_, { streams }) => {
        vidObject.width = streams[0].width
        this.saveDimensions(filename, type, [vidObject.width, streams[0].height])
        const pngPosterFilename = filename.replace(FILE_EXT.webm, FILE_EXT.png)
        const posterPath = this.isThumb(type) ?
          THUMBNAIL_ORIGINAL_POSTER_PATH : this.originalPosterPath
        ffmpeg(source).screenshots({
          filename: pngPosterFilename,
          timestamps: [0],
          folder: posterPath
        }).on('end', async () => {
          const pngPosterPath = joinPaths(posterPath, pngPosterFilename)
          await sharp(pngPosterPath)
            .toFile(pngPosterPath.replace(FILE_EXT.png, FILE_EXT.webp))
          await fs.rm(pngPosterPath)
          resolve()
        })
      }))
  }

  async resizeThumb() {
    const thumbSuffix = '.' + (this.thumbIsAnimated ? FILE_EXT.webm : FILE_EXT.webp)
    const filename = `${this.id}${thumbSuffix}`
    const size = this.breakpointMediaSizes._thumbnails
    const isImage = !this.thumbIsAnimated
    await this.resizeMedia({
      filename, isImage, size, type: MEDIA_TYPES.thumbnails
    })
    if (isImage) return
    await this.resizeMedia({
      filename: filename.replace(FILE_EXT.webm, FILE_EXT.webp),
      isImage: true,
      type: MEDIA_TYPES.thumbnailPosters,
      subfolder: POSTER_SUBPATH,
      size
    })
  }

  async resizeImgGroups(imageGroups) {
    await mapObject(imageGroups, async (imgGroupSubfolder, { count, size }) => {
      await emptyDir(joinPaths(this.breakpointPath, imgGroupSubfolder))
      for (let i = 0; i < count; i++)
        await this.resizeMedia({
          filename: `${i + 1}.webp`,
          type: MEDIA_TYPES.imageGroups,
          isImage: true,
          subfolder: imgGroupSubfolder,
          size
        })
    })
  }

  getWidth(size, vw) {
    return Math.round(this.breakpointSize * size * vw * MEDIA_ENLARGEMNET_FACTOR)
  }

  saveDimensions(filename, type, dimensions) {
    if (!this.isThumb(type)) (this.nativeSizes[type] ??= {})[filename] ??= dimensions
    else this.nativeSizes[type] = dimensions
  }

  log(message, emphasize) {
    const pageIdHeader = `${this.id} -`
    const logColor = LOG_COLORS[this.breakpoint]
    const deoratedPageIdHeader = emphasize ? chalk.bold(pageIdHeader) : pageIdHeader
    const decoratedMessage = `${chalk[logColor](
      `${deoratedPageIdHeader} ${this.breakpoint.toLocaleUpperCase()}:`
    )} ${message}`
    console.log(
      emphasize ? decoratedMessage : chalk.italic(decoratedMessage)
    )
  }

  isImgGroup(type) {
    return type === MEDIA_TYPES.imageGroups
  }

  isThumb(type) {
    return type === MEDIA_TYPES.thumbnails
  }

  isToolTip(type) {
    return type === MEDIA_TYPES.toolTips
  }

  isPoster(type) {
    return type === MEDIA_TYPES.posters
  }

  isThumbPoster(type) {
    return type === MEDIA_TYPES.thumbnailPosters
  }

  get thumbIsAnimated() {
    return this.workData.animatedThumbnail
  }

  get isFallback() {
    return this.breakpoint === DESKTOP_FALLBACK_BREAKPOINT
  }
}

resizeImages()