import { Falsey } from 'lodash'

export type coorTuple = [number, number]
export type coorObject = { x: number, y: number }
export type queueFunctionType<T> = (() => T) | {
  run: () => T,
  callback: () => void
}

export type optionalQueueFunctionType<T = void> = queueFunctionType<T> | Falsey

export type queueArgType<T = void> = optionalQueueFunctionType<T> | optionalQueueFunctionType<T>[] 