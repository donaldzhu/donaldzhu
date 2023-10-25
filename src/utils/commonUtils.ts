import { Falsey } from 'lodash'
import ElemRect from './helpers/rect/elemRect'
import { BrowserType, CoorObject, CoorObject3D, coorTuple } from './utilTypes'

// string
export const capitalize = <T extends string>(string: T) => string.charAt(0)
  .toUpperCase() + string.slice(1) as Capitalize<T>
export const joinPaths = (...paths: string[]) => paths.filter(p => p).join('/')

export function validateString(string: string): string
export function validateString<T>(validator: T, string?: string): string
export function validateString<T>(validatorOrString: T | string, string?: string) {
  if (!string) return validatorOrString || ''
  return validatorOrString ? string : ''
}


// number
export const map = (
  value: number,
  inMin: number,
  inMax: number,
  outMin = 0,
  outMax = 1
) =>
  (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin

export const lerp = (a: number, b: number, alpha: number) =>
  a + alpha * (b - a)

// array
export const repeatMap = <T>(repetition: number, callback: (i: number) => T) => {
  const accumulatedReturns: T[] = []
  for (let i = 0; i < repetition; i++)
    accumulatedReturns.push(callback(i))
  return accumulatedReturns
}

export const repeat = <T>(repetition: number, value: T) => Array(repetition).fill(value)

export const arrayify = <T>(possibleArray: T | T[]) =>
  Array.isArray(possibleArray) ? possibleArray : [possibleArray]
export const shuffleTo = <T>(array: T[], index: number) => {
  array = [...array]
  return [...array.splice(index), ...array]
}

export const sortLike = <T>(array: T[], modelArray: T[]): T[] =>
  array.sort((a, b) =>
    modelArray.indexOf(a) - modelArray.indexOf(b))

export const partition = <T, F>(
  array: (T | F)[],
  filterCallback: (elem: T | F) => boolean
): [T[], F[]] => {
  const filterTrue = (elem: T | F): elem is T => filterCallback(elem)
  const filterFalse = (elem: T | F): elem is F => !filterCallback(elem)
  const trueArray: T[] = array.filter(filterTrue)
  const falseArray: F[] = array.filter(filterFalse)
  return [trueArray, falseArray]
}

// object
export const loopObject = <T extends object>(
  object: T,
  callback: (key: keyof T, value: T[keyof T], object: T) => any
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

export const keysToObject = <T extends PropertyKey, V>(array: T[], callback: (
  key: T,
  obj: Record<T, V>,
  i: number) => V) => array.reduce((obj, key, i) => ({
    ...obj, [key]: callback(key, obj, i)
  }), {} as Record<T, V>)

export const toPairs = <T extends object>(object: T) => {
  const keys = typedKeys<T>(object)
  return keys.map(key => [key, object[key]] satisfies [keyof T, T[keyof T]])
}


// util
export const appendQuery = (...queries: [string, string | null | undefined][]) =>
  queries.reduce((string, [queryKey, queryValue], i) =>
    string += i ? '&' : '' + `${queryKey}=${queryValue}`, '?')

export const getToolTipPoints = <T extends Element>(toolTip: ElemRect<T>, popUp: ElemRect<T>):
  [coorTuple, coorTuple, coorTuple, coorTuple] => {
  if (popUp.y2 >= toolTip.y2 && popUp.y1 <= toolTip.y1)
    return [popUp.topRight, toolTip.topRight, toolTip.botRight, popUp.botRight]
  if (popUp.y2 <= toolTip.y2)
    return [popUp.topRight, toolTip.topRight, toolTip.botLeft, popUp.botLeft]
  return [popUp.topLeft, toolTip.topLeft, toolTip.botRight, popUp.botRight]
}

export const filterFalsy = <T>(array: T[]) =>
  array.filter(elem => elem) as Exclude<T, Falsey>[]

export function getBlankCoors(withZ: false): CoorObject
export function getBlankCoors(withZ: true): CoorObject3D
export function getBlankCoors(withZ = false) {
  const withoutZ = { x: 0, y: 0 }
  return withZ ? { ...withoutZ, z: 0 } : withoutZ
}

export function isBrowser(browserToMatch: BrowserType | BrowserType[]) {
  return arrayify(browserToMatch).some(browser => navigator.userAgent.includes(browser))
}