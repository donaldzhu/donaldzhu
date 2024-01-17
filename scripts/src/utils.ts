import fs from 'fs'
import { MediaType, imgExtensionRegex, vidExtensionRegex } from './resizer/lib/resizerTypes'
import path from 'path'

export const mkdirIfNone = (folderPath: string) => {
  try {
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true })
      return true
    }
    else return false
  } catch (err) {
    throw err
  }
}

export const emptyDir = (folderPath: string) => {
  try {
    fs.rmSync(folderPath, { recursive: true })
  } catch (err) {
    // @ts-ignore
    if (err.code !== 'ENOENT')
      throw err
  }
  fs.mkdirSync(folderPath, { recursive: true })
}

export const joinPaths = (...paths: (string | undefined)[]) =>
  paths.filter(p => p).join('/')

export const removeFile = (path: string) => {
  try {
    if (fs.existsSync(path)) {
      fs.rmSync(path)
      return true
    }
    else return false
  } catch (err) {
    throw err
  }
}

export const parseMediaType = (fileName: string) => {
  const imgRegex = new RegExp(`.(${imgExtensionRegex})$`, 'i')
  const vidRegex = new RegExp(`.(${vidExtensionRegex})$`, 'i')
  if (fileName.match(imgRegex) || fileName.match(/\*$/)) return MediaType.Image
  if (fileName.match(vidRegex)) return MediaType.Video
  throw new Error(`${fileName} is neither an image nor a video.`)
}

export const getExtension = (fileName: string) => path.extname(fileName).slice(1)

export const loopObject = <T extends object>(
  object: T,
  callback: (key: keyof T, value: T[keyof T], object: T) => void
) => {
  const keys = typedKeys(object)
  keys.forEach(key => {
    const value = object[key]
    callback(key, value, object)
  })

  return object
}

export function typedKeys<T extends object>(object: T): (keyof T)[]
export function typedKeys<T extends string>(object: object): T[]
export function typedKeys<T extends (object | string)>(object: T) {
  return Object.keys(object) as (T extends object ? keyof T : T)[]
}

export const mapObject = <T extends object, R>(
  object: T,
  callback: (key: keyof T, value: T[keyof T]) => R
) => {
  const newObject: Partial<Record<keyof T, R>> = {}
  const keys = typedKeys(object)
  keys.forEach(key => {
    const value = object[key]
    newObject[key] = callback(key, value)
  })

  return newObject as Record<keyof T, R>
}

export const mapPromises = async <T, R>(
  array: T[],
  callback: (value: T, index: number, array: T[]) => R
): Promise<Awaited<R>[]> => {
  const results: Awaited<R>[] = []

  let i = 0
  for await (const value of array) {
    results.push(await callback(value, i, array))
    i++
  }

  return results
}
export const mapObjectPromises = async <K extends string, V>(
  object: Record<K, V>,
  callback: (key: K, value: V, object: Record<K, V>) => Promise<void>
) => {
  const keys = Object.keys(object) as K[]
  for await (const key of keys) {
    const value = object[key]
    await callback(key, value, object)
  }
  return object
}

export const readJsonSync = (filePath: string) => JSON.parse(fs.readFileSync(filePath, 'utf8'))
export const sortFileNames = (fileA: string, fileB: string) => {
  const collator = new Intl.Collator('us-EN')
  const returnDefault = () => collator.compare(fileA, fileB)

  if (
    path.dirname(fileA) !== path.dirname(fileB) ||
    path.extname(fileA) !== path.extname(fileB) ||
    !path.extname(fileA)
  ) return returnDefault()

  const fileNameA = path.parse(fileA).name
  const fileNameB = path.parse(fileB).name

  const getSuffix = (fileName: string) => fileName.match(/[0-9].*$/)
  const suffixAMatch = getSuffix(fileNameA)
  const suffixBMatch = getSuffix(fileNameB)

  if (!suffixAMatch || !suffixBMatch) return returnDefault()
  const suffixA = suffixAMatch[0]
  const suffixB = suffixBMatch[0]

  const getPrefix = (fileName: string, suffix: string) => fileName.replace(suffix, '')
  const prefixA = getPrefix(fileNameA, suffixA)
  const prefixB = getPrefix(fileNameB, suffixB)

  if (
    prefixA !== prefixB ||
    Number.isNaN(+suffixA) ||
    Number.isNaN(+suffixB)
  ) return returnDefault()

  return Number(suffixA) - Number(suffixB)
}

export const forEachFile = async (
  path: string,
  callback: (fileName: string, fileData: string, files: string[]) => any) => {
  const files = fs.readdirSync(path)
  for (let i = 0; i < files.length; i++) {
    const fileName = files[i]
    const fileData = fs.readFileSync(`${path}/${fileName}`, 'utf8')
    callback(fileName, fileData, files)
  }
}