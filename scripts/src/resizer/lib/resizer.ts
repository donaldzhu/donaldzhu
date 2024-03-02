import fs, { renameSync, unlinkSync } from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import _ from 'lodash'
import sharp from 'sharp'
import ffmpeg, { FfmpegCommand } from 'fluent-ffmpeg'
import { globSync } from 'glob'
import chalk from 'chalk'
import BreakpointResizer from './breakptResizer'
import { BreakptConfig, ImgExtension, MediaOptions, MediaType, ResizePosterConfig, ResizerConfig, callbackType, Metadata, vidExportTypes } from './resizerTypes'
import { joinPaths, removeFile, parseMediaType, getExtension, mapPromises, sortFileNames, mkdir, filterFalsy } from '../../utils'
import { DASH_CONFIGS, DASH_SUBFOLDER, POSTER_SUBFOLDER } from './constants'
import { isOdd, replaceExt, roundEven } from '../resizeUtils'

class Resizer<K extends string> {
  source: string
  breakptConfigs: BreakptConfig<K>[]

  destination: string
  breakptResizers: BreakpointResizer<K>[]
  allFileEntries: string[]
  mediaOptions: MediaOptions
  removeFilesAtDest: boolean
  exportPoster: boolean
  exportTypes: MediaType[]
  debugOnly: boolean
  callback: callbackType

  constructor(
    source: string,
    breakptConfigs: BreakptConfig<K>[],
    {
      destination,
      mediaOptions = {},
      removeFilesAtDest = true,
      exportPoster = true,
      exportTypes = [],
      callback = _.noop
    }: ResizerConfig = {}) {
    this.source = source
    this.breakptConfigs = breakptConfigs

    this.destination = destination || source
    this.breakptResizers = breakptConfigs.map(config => new BreakpointResizer(
      source, config,
      {
        destination: this.destination,
        mediaOptions,
        removeFilesAtDest,
        exportPoster,
        exportTypes
      }
    ))

    this.allFileEntries = _.union(...this.breakptConfigs.map(config =>
      config.sizes.map(size => size[0])))

    this.mediaOptions = mediaOptions
    this.removeFilesAtDest = removeFilesAtDest
    this.exportPoster = exportPoster
    this.exportTypes = exportTypes
    this.debugOnly = !_.some(this.breakptConfigs, { debugOnly: false })
    this.callback = callback
  }

  async init() {
    if (this.shouldExport(MediaType.Poster))
      this.createSrcPosterDir()
    if (this.shouldExport(MediaType.Dash))
      this.createDestDashDir()

    this.mapBreakpts(resizer => resizer.init())
    const mapAllEntries = async (fileEntry: string) => {
      const fileNames = globSync(
        this.joinSrcPath(fileEntry),
        { nodir: true }
      ).sort(sortFileNames)
      await mapPromises(fileNames, async fileName =>
        await this.resizeMedia(this.extractSrcSubpath(fileName), fileEntry))
    }

    await mapPromises(this.allFileEntries, async fileEntry =>
      await mapAllEntries(fileEntry))
  }

  private createSrcPosterDir() {
    if (this.hasVid && this.exportPoster) mkdir(
      this.joinSrcPath(POSTER_SUBFOLDER),
      this.removeFilesAtDest
    )
  }

  private createDestDashDir() {
    if (this.hasVid) {
      mkdir(joinPaths(this.destination, DASH_SUBFOLDER), this.removeFilesAtDest)
      vidExportTypes.forEach(type => mkdir(
        joinPaths(this.destination, DASH_SUBFOLDER, type),
        this.removeFilesAtDest
      ))
    }
  }

  private async resizeMedia(fileName: string, fileEntry: string) {
    const type = parseMediaType(fileName)
    if (type === MediaType.Image) await this.resizeImg(fileName, fileEntry)
    else if (type === MediaType.Video) await this.resizeVid(fileName, fileEntry)
    else throw new Error(`${fileName} is not an approved file type.`)
  }

  private async resizeImg(fileName: string, fileEntry: string): Promise<void>
  private async resizeImg(fileName: string, fileEntry: string, posterConfig?: ResizePosterConfig): Promise<void>
  private async resizeImg(fileName: string, fileEntry: string, posterConfig?: ResizePosterConfig) {
    const imgPath = posterConfig ? fileName : this.joinSrcPath(fileName)
    const isAnimated = getExtension(imgPath) === ImgExtension.Gif
    const imgObj = sharp(imgPath, { animated: isAnimated })
    const size = posterConfig ? posterConfig.vidSize :
      this.throwNoWidth(await imgObj.metadata(), fileName)
    const isPoster = !!posterConfig
    const shouldExport = isPoster || this.shouldExport(MediaType.Image)

    if (shouldExport) await this.mapBreakpts(async resizer =>
      await resizer.resizeImg(imgObj, {
        metadata: size,
        fileName: posterConfig ? posterConfig.vidFileName : fileName,
        fileEntry,
        isPoster: !!posterConfig
      }))

    this.log(imgPath, isPoster ? MediaType.Poster : MediaType.Image, shouldExport)
    if (!posterConfig) this.callback(imgPath, size)
  }

  private async resizeVid(fileName: string, fileEntry: string) {
    const vidPath = this.joinSrcPath(fileName)
    let vidObj = this.createFfmpeg(vidPath)
    const metadata = await new Promise<Metadata>(resolve => {
      vidObj.ffprobe(async (_, metadata) =>
        resolve(this.throwNoWidth(metadata.streams[0], fileName)))
    })
    const { width, height } = metadata

    const pngPosterPath = this.getScreenshotPath(vidPath)
    const webpPosterPath = this.getPosterPath(pngPosterPath)
    if (this.exportPoster && this.shouldExport(MediaType.Poster)) {
      await new Promise<null>(resolve => {
        removeFile(pngPosterPath)
        removeFile(webpPosterPath)

        ffmpeg(vidPath).screenshots({
          filename: path.basename(pngPosterPath),
          timestamps: [0],
          folder: this.joinSrcPath(POSTER_SUBFOLDER)
        }).on('end', async () => {
          await sharp(pngPosterPath)
            .webp(this.mediaOptions.webp)
            .toFile(webpPosterPath)
          fs.rmSync(pngPosterPath)
          resolve(null)
        })
      })

      this.resizeImg(webpPosterPath, fileEntry, {
        vidSize: metadata, vidFileName: fileName
      })
    }

    if (this.shouldExport(MediaType.Video)) {
      const { dir, name, ext } = path.parse(vidPath)
      const tempPath = `${dir}/${name}_temp${ext}`
      const shouldResizeOriginal = isOdd(width) || isOdd(height)

      if (shouldResizeOriginal) {
        vidObj
          .size(`${roundEven(width)}x?`)
          .output(tempPath)

        await this.runFfmpeg(vidObj)
        unlinkSync(vidPath)
        renameSync(tempPath, vidPath)

        vidObj = this.createFfmpeg(vidPath)
      }

      await this.mapBreakpts(async resizer => await resizer
        .resizeVideo(vidObj, { metadata, fileName, fileEntry }))
      await this.runFfmpeg(vidObj)

    }

    this.log(vidPath, MediaType.Video, this.shouldExport(MediaType.Video))

    if (this.shouldExport(MediaType.Dash))
      this.generateDash(fileName, metadata, this.shouldExport(MediaType.Dash))
    this.log(vidPath, MediaType.Dash, this.shouldExport(MediaType.Dash))

    this.callback(vidPath, metadata)
  }

  private async generateDash(fileName: string, metadata: Metadata, shouldExport: boolean) {
    const { name, ext } = path.parse(fileName)
    const { width, height } = metadata

    let srcPath = this.joinSrcPath(fileName)
    const shouldCreateMp4 = ext !== '.mp4' && shouldExport

    if (shouldCreateMp4) {
      const vidObj = this.createFfmpeg(srcPath)
      srcPath = srcPath.replace(/\.webm$/, '_temp.mp4')
      vidObj.output(srcPath)
      await this.runFfmpeg(vidObj)
    }

    const getEvenWidth = (resizedHeight: number) => 2 * Math.round(width / height * resizedHeight / 2)
    const qualityMap = DASH_CONFIGS
      .map(({ size, bitrate }, i) => {
        if (size > height) return
        return `-map v:0 -s:${i} ${getEvenWidth(size)}x${size} -b:v:${i} ${bitrate}`
      })

    const qualityFilters = filterFalsy(qualityMap).join(' ')
    const gopSize = 100

    const destFolderPath = joinPaths(this.destination, DASH_SUBFOLDER, name)
    const command = `
    nice -n 5 ffmpeg -i ${srcPath} -y \\
    -c:v libx264 -preset veryslow -sc_threshold 0 -r 25 \\
    -keyint_min ${gopSize} -g ${gopSize} -hide_banner -loglevel warning \\
    ${qualityFilters} \\
    -use_template 1 -use_timeline 1 -seg_duration 4 \\
    -adaptation_sets "id=0,streams=v" \\
    -f dash ${destFolderPath}/dash.mpd
    `

    mkdir(destFolderPath, this.removeFilesAtDest)
    execSync(command)
    if (shouldCreateMp4) unlinkSync(srcPath)
  }

  private createFfmpeg(source: string) {
    return ffmpeg({ source, priority: 10 }).noAudio()
  }

  private async runFfmpeg(ffmpegCommand: FfmpegCommand) {
    return await new Promise<null>(resolve => ffmpegCommand
      .on('end', () => resolve(null))
      .on('error', err => console.log(err))
      .run()
    )
  }

  private joinSrcPath(...subpaths: (string | undefined)[]) {
    return joinPaths(this.source, ...subpaths)
  }

  private extractSrcSubpath(fullPath: string) {
    const sourceRegex = new RegExp(`${this.source}/?`)
    return fullPath.replace(sourceRegex, '')
  }

  private async mapBreakpts(callback: (resizer: BreakpointResizer<K>) => Promise<any> | void) {
    await mapPromises(this.breakptResizers, async resizer => await callback(resizer))
  }

  private log(fileName: string, type: MediaType, isExport: boolean) {
    const colors = {
      [MediaType.Image]: 'green',
      [MediaType.Video]: 'cyan',
      [MediaType.Poster]: 'yellow',
      [MediaType.Dash]: 'magenta',
    } as const

    const color = colors[type]
    console.log(`${chalk[isExport ? 'white' : 'gray'](`${isExport ?
      'Resized' : 'Debugged'} [ ${type} ]: `)}${chalk[color](fileName)}`)
  }

  private getScreenshotPath(filename: string) {
    return joinPaths(
      path.dirname(filename),
      POSTER_SUBFOLDER,
      path.basename(replaceExt(filename, ImgExtension.Png)),
    )
  }

  private getPosterPath(filename: string) {
    return filename.replace(ImgExtension.Png, ImgExtension.Webp)
  }

  private throwNoWidth(metadata: Partial<Metadata>, fileName: string) {
    const { width, height, pageHeight } = metadata
    if (!width || !height) throw new Error(`Cannot read dimensions of ${fileName}.`)
    return { width, height: pageHeight ?? height }
  }

  private shouldExport(type: MediaType) {
    return !this.debugOnly && (this.exportTypes.length === 0 || this.exportTypes.includes(type))
  }

  private get hasVid() {
    return !!this.allFileEntries.find(fileName =>
      parseMediaType(fileName) === MediaType.Video)
  }
}

export default Resizer