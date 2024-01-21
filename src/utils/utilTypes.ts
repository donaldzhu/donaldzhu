import type { Falsey } from 'lodash'

export type coorTuple = [number, number]
export interface CoorObject { x: number, y: number }
export interface CoorObject3D { x: number, y: number, z: number }
export type queueFunctionType<T> = (() => T) | {
  run: () => T,
  callback?: (res: Awaited<T> | (Awaited<T> | undefined)[] | undefined) => void
}

export enum BrowserType {
  Chrome = 'Chrome',
  Edge = 'Edge',
  Firefox = 'Firefox',
  Opera = 'Opera',
  Safari = 'Safari'
}

export const enum Environment {
  Production = 'production',
  Development = 'development'
}

type optionalQueueFunctionType<T = void> = queueFunctionType<T> | Falsey

export type queueArgType<T = void> = optionalQueueFunctionType<T> | optionalQueueFunctionType<T>[]