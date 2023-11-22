import type { Falsey } from 'lodash'
import type { MutableRefObject } from 'react'

export const validateRef = <T,>(ref: MutableRefObject<T> | undefined | null):
  ref is MutableRefObject<Exclude<T, Falsey>> => !!ref?.current
