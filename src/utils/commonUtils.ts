import { Falsey } from 'lodash'
import ElemRect from './helpers/rect/elemRect'
import { coorTuple } from './utilTypes'

// string
export const capitalize = <T extends string>(string: T) => string.charAt(0)
  .toUpperCase() + string.slice(1) as Capitalize<T>

// number
export const map = (value: number, inMin: number, inMax: number, outMin: number, outMax: number) =>
  (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin

// array
export const repeatMap = <T>(repetition: number, callback: (i: number) => T) => {
  const accumulatedReturns: T[] = []
  for (let i = 0; i < repetition; i++)
    accumulatedReturns.push(callback(i))
  return accumulatedReturns
}

export const repeat = <T>(repetition: number, value: T) => Array(repetition).fill(value)

export const arrayify = <T>(possibleArray: T | T[]) => Array.isArray(possibleArray) ? possibleArray : [possibleArray]
export const shuffleTo = <T>(array: T[], index: number) => {
  array = [...array]
  return [...array.splice(index), ...array]
}

export const sortLike = <T>(array: T[], modelArray: T[]): T[] =>
  array.sort((a, b) =>
    modelArray.indexOf(a) - modelArray.indexOf(b))

// object
export const loopObject = <T extends object>(
  object: T,
  callback: (key: keyof T, value: T[keyof T], object: T) => any
) => {
  const keys = typedKeys(object)
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    const value = object[key]
    callback(key, value, object)
  }
  return object
}

export const mapObject = <T extends object, R>(
  object: T,
  callback: (key: keyof T, value: T[keyof T]) => R
) => {
  const newObject: Partial<Record<keyof T, R>> = {}
  const keys = typedKeys(object)
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    const value = object[key]
    newObject[key] = callback(key, value)
  }
  return newObject as Record<keyof T, R>
}

export const keysToObject = <T extends PropertyKey, V>(array: T[], callback: (
  key: T,
  obj: Record<T, V>,
  i: number) => V) => array.reduce((obj, key, i) => ({
    ...obj, [key]: callback(key, obj, i)
  }), {} as Record<T, V>)

// util
export const joinPaths = (...paths: string[]) => paths.filter(p => p).join('/')
export const appendQuery = (...queries: [string, string | null | undefined][]) => queries.reduce((string, [queryKey, queryValue], i) =>
  string += i ? '&' : '' + `${queryKey}=${queryValue}`, '?')

export const getToolTipPoints = <T extends Element>(toolTip: ElemRect<T>, popUp: ElemRect<T>):
  [coorTuple, coorTuple, coorTuple, coorTuple] => {
  if (popUp.y2 >= toolTip.y2 && popUp.y1 <= toolTip.y1)
    return [popUp.topRight, toolTip.topRight, toolTip.botRight, popUp.botRight]
  if (popUp.y2 <= toolTip.y2)
    return [popUp.topRight, toolTip.topRight, toolTip.botLeft, popUp.botLeft]
  return [popUp.topLeft, toolTip.topLeft, toolTip.botRight, popUp.botRight]
}

export function validateString(string: string): string
export function validateString<T>(validator: T, string?: string): string
export function validateString<T>(validatorOrString: T | string, string?: string) {
  if (!string) return validatorOrString || ''
  return validatorOrString ? string : ''
}

export function typedKeys<T extends object>(object: T): (keyof T)[]
export function typedKeys<T extends string>(object: object): T[]
export function typedKeys<T extends (object | string)>(object: T) {
  return Object.keys(object) as (T extends object ? keyof T : T)[]
}

export const toPairs = <T extends object>(object: T) => {
  const keys = typedKeys<T>(object)
  return keys.map(key => [key, object[key]] satisfies [keyof T, T[keyof T]])
}

export const filterFalsy = <T>(array: T[]) =>
  array.filter(elem => elem) as Exclude<T, Falsey>[]

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