import ffmpeg from 'fluent-ffmpeg'
import { globSync } from 'glob'
import _ from 'lodash'
import path from 'path'
import sharp from 'sharp'

import {
  getExtension, joinPaths, mkdir, mkdirIfNone, parseMediaType, removeFile
} from '../../utils'
import { replaceExt, roundEven } from '../resizeUtils'
import { POSTER_SUBFOLDER } from './constants'
import {
  BreakptConfig, BreakptResizeConfig, BreakptResizerConfig, ImgExtension, MediaOptions, MediaType,
  Metadata, vidExportTypes
} from './resizerTypes'

class BreakpointResizer<K extends string> {
  destination: string
  breakptTypes: MediaType[]
  mediaOptions: MediaOptions
  removeFilesAtDest: boolean
  exportPoster: boolean
  exportTypes: MediaType[]
  debugOnly: boolean

  constructor(
    public source: string,
    public config: BreakptConfig<K>,
    {
      destination,
      mediaOptions,
      removeFilesAtDest,
      exportPoster,
      exportTypes
    }: BreakptResizerConfig
  ) {
    this.destination = joinPaths(destination, this.config.breakpt)

    this.breakptTypes = _.uniq(
      config.sizes
        .map(size => size[0])
        .map(fileEntry => {
          const fileNames = globSync(this.joinDestPath(fileEntry), { nodir: true })
          return fileNames.map(parseMediaType)
        })
        .flat()
    )

    this.mediaOptions = mediaOptions
    this.removeFilesAtDest = removeFilesAtDest
    this.exportPoster = exportPoster
    this.exportTypes = exportTypes
    this.debugOnly = config.debugOnly
  }

  init() {
    if (this.debugOnly) return
    this.createDestDir()
    this.createDestVidDir()
    this.createDestPosterDir()
  }

  async resizeImg(imgObj: sharp.Sharp, {
    metadata, fileName, fileEntry, isPoster
  }: BreakptResizeConfig) {
    const { width } = metadata
    const resizeWidth = this.getResizeWidth(fileEntry, metadata)

    if (
      !resizeWidth ||
      !(isPoster ?
        this.shouldExportPoster :
        this.shouldExport(MediaType.Image))
    ) return

    const imgObjClone = imgObj.clone()
    if (width > resizeWidth)
      imgObjClone.resize({ width: resizeWidth })
    if (this.config.blur) imgObjClone.blur(this.config.blur)

    if (isPoster) fileName = this.getPosterPath(fileName)
    const outFile = this.joinDestPath(fileName)
    this.prepareDest(outFile)

    const fileType = getExtension(fileName)
    if (fileType === ImgExtension.Gif)
      imgObjClone.gif(this.mediaOptions.gif)
    else if (fileType === ImgExtension.Webp)
      imgObjClone.webp(this.mediaOptions.webp)

    return await imgObjClone.toFile(outFile)
  }

  async resizeVideo(vidObj: ffmpeg.FfmpegCommand, {
    metadata, fileName, fileEntry
  }: BreakptResizeConfig) {
    const resizeWidth = this.getResizeWidth(fileEntry, metadata)

    if (
      !resizeWidth ||
      !this.shouldExport(MediaType.Video)
    ) return

    for (let i = 0; i < vidExportTypes.length; i++) {
      const type = vidExportTypes[i]
      const outFile = replaceExt(this.joinDestPath(type, fileName), type)
      this.prepareDest(outFile)
      vidObj
        .size(`${resizeWidth}x?`)
        .output(outFile)
    }
  }

  private joinDestPath(...subpaths: (string | undefined)[]) {
    return joinPaths(this.destination, ...subpaths)
  }

  private createDestDir(...subpaths: (string | undefined)[]) {
    mkdir(this.joinDestPath(...subpaths),
      !this.exportTypes.length &&
      this.removeFilesAtDest
    )
  }

  private createDestVidDir() {
    if (this.shouldExport(MediaType.Video) && this.hasVid)
      vidExportTypes.forEach(type => this.createDestDir(type))
  }

  private createDestPosterDir() {
    if (this.shouldExportPoster && this.hasVid)
      this.createDestDir(POSTER_SUBFOLDER)
  }

  private prepareDest(fileName: string) {
    removeFile(fileName)
    mkdirIfNone(path.dirname(fileName))
  }

  private getSizePercentage(fileName: string) {
    const size = this.config.sizes.find(size => size[0] === fileName)
    return size ? size[1] : undefined
  }

  private getResizeWidth(fileName: string, size: Metadata) {
    const { breakptWidth, maxDimension, noResize } = this.config
    const { width, height } = size
    const maxWidth = maxDimension ? Math.round(Math.sqrt(maxDimension * width / height)) : width
    if (noResize || !breakptWidth) return Math.min(width, maxWidth)

    const sizePercentage = this.getSizePercentage(fileName)
    if (!sizePercentage) return

    const resizedWidth = Math.round(sizePercentage * breakptWidth)
    return roundEven(Math.min(resizedWidth, maxWidth, width))
  }

  private getPosterPath(fileName: string) {
    return joinPaths(
      POSTER_SUBFOLDER,
      replaceExt(fileName, ImgExtension.Webp)
    )
  }

  private _shouldExportType(type: MediaType) {
    return !this.debugOnly && (
      this.exportTypes.length === 0 ||
      this.exportTypes.includes(type)
    )
  }

  private shouldExport(type: MediaType) {
    return this._shouldExportType(type) &&
      !this.config.exclude?.includes(type)
  }

  private get shouldExportPoster() {
    return this.exportPoster &&
      this._shouldExportType(MediaType.Poster)
  }

  private get hasVid() {
    return this.breakptTypes.includes(MediaType.Video)
  }
}

export default BreakpointResizer