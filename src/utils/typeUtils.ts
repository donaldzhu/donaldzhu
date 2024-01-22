import type { Falsey } from 'lodash'
import type { MutableRefObject } from 'react'

export const validateRef = <T>(ref: MutableRefObject<T> | undefined | null):
  ref is MutableRefObject<Exclude<T, Falsey>> => !!ref?.current

export const noRefError = (refName?: string) => {
  return Error(`${refName ?? 'Ref'} - current value is unexpectedly null or undefined.`)
}

export const noStackDataError = (stackDataName: string) => {
  return Error(`${stackDataName} - no stackData found.`)
}