import path from 'path'
import fs from 'fs'
import sharp from 'sharp'
import ffmpeg from 'fluent-ffmpeg'
import _ from 'lodash'
import { globSync } from 'glob'
import { BreakptConfig, BreakptResizeConfig, BreakptResizerConfig, MediaTypes, VidExtensions, ImgExtentions, MediaOptions, dimensionType } from './resizerTypes'
import { mkdirIfNone, emptyDir, joinPaths, removeFile, parseMediaType, getExtension } from '../../utils'
import { POSTER_SUBFOLDER } from '../constants'

class BreakpointResizer<K extends string> {
  source: string
  config: BreakptConfig<K>
  destination: string
  breakptTypes: MediaTypes[]
  mediaOptions: MediaOptions
  removeFilesAtDest: boolean
  exportPoster: boolean
  constructor(
    source: string,
    config: BreakptConfig<K>,
    {
      destination,
      mediaOptions,
      removeFilesAtDest,
      exportPoster
    }: BreakptResizerConfig) {
    this.source = source
    this.config = config
    this.destination = joinPaths(destination, this.config.breakpt)

    this.breakptTypes = _.uniq(
      config.sizes
        .map(size => size[0])
        .map(fileEntry => {
          const fileNames = globSync(this.getSubpath(fileEntry), { nodir: true })
          return fileNames.map(parseMediaType)
        })
        .flat()
    )

    this.mediaOptions = mediaOptions
    this.removeFilesAtDest = removeFilesAtDest
    this.exportPoster = exportPoster
  }

  init() {
    this.createFolder()
    this.createPosterFolder()
  }

  async resizeImg(imgObj: sharp.Sharp, {
    size, fileName, fileEntry, isPoster
  }: BreakptResizeConfig) {
    const { width } = size
    const resizeWidth = this.getResizeWidth(fileEntry, size)
    if (
      !resizeWidth ||
      !this.shouldExport(MediaTypes.image) ||
      (isPoster && !this.shouldExport(MediaTypes.poster)) ||
      this.config.debugOnly
    ) return

    const imgObjClone = imgObj.clone()
    if (width > resizeWidth)
      imgObjClone.resize({ width: resizeWidth })
    if (this.config.blur) imgObjClone.blur(this.config.blur)

    if (isPoster) fileName = this.getPosterPath(fileName)
    const outFile = this.getSubpath(fileName)
    this.prepareDest(outFile)

    const fileType = getExtension(fileName)
    if (fileType === ImgExtentions.gif)
      imgObjClone.gif(this.mediaOptions.gif)
    else if (fileType === ImgExtentions.webp)
      imgObjClone.webp(this.mediaOptions.webp)

    return await imgObjClone.toFile(outFile)
  }

  async resizeVideo(vidObj: ffmpeg.FfmpegCommand, {
    size, fileName, fileEntry
  }: BreakptResizeConfig) {
    const { width } = size
    const resizeWidth = this.getResizeWidth(fileEntry, size)
    if (
      !resizeWidth ||
      !this.shouldExport(MediaTypes.video) ||
      this.config.debugOnly
    ) return

    if (width > resizeWidth) vidObj.size(`${resizeWidth}x?`)

    const outFile = this.getSubpath(fileName)
    this.prepareDest(outFile)
    vidObj.output(outFile)
  }

  private getSubpath(...subpaths: (string | undefined)[]) {
    return joinPaths(this.destination, ...subpaths)
  }

  private createFolder(...subpaths: (string | undefined)[]) {
    if (this.config.debugOnly) return
    const filePath = this.getSubpath(...subpaths)
    if (this.removeFilesAtDest) emptyDir(filePath)
    else mkdirIfNone(filePath)
  }

  private createPosterFolder() {
    if (
      this.hasVid &&
      this.exportPoster &&
      this.shouldExport(MediaTypes.video) &&
      this.shouldExport(MediaTypes.poster) &&
      !this.config.debugOnly
    ) this.createFolder(POSTER_SUBFOLDER)
  }

  private prepareDest(fileName: string) {
    removeFile(fileName)
    mkdirIfNone(path.dirname(fileName))
  }

  private getSizePercentage(fileName: string) {
    const size = this.config.sizes.find(size => size[0] === fileName)
    return size ? size[1] : undefined
  }

  private getResizeWidth(fileName: string, size: dimensionType) {
    const { breakptWidth, maxDimension, noResize } = this.config
    const { width, height } = size
    const maxWidth = maxDimension ? Math.round(Math.sqrt(maxDimension * width / height)) : width
    if (noResize || !breakptWidth) return Math.min(width, maxWidth)

    const sizePercentage = this.getSizePercentage(fileName)
    if (!sizePercentage) return

    const resizedWidth = Math.round(sizePercentage * breakptWidth)
    return Math.min(resizedWidth, maxWidth)
  }

  private getPosterPath(fileName: string) {
    return joinPaths(
      POSTER_SUBFOLDER,
      fileName.replace(VidExtensions.webm, ImgExtentions.webp)
    )
  }

  private shouldExport(type: MediaTypes) {
    return !this.config.exclude?.includes(type)
  }

  private get hasVid() {
    return this.breakptTypes.includes(MediaTypes.video)
  }
}

export default BreakpointResizer