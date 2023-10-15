import { Falsey } from 'lodash'
import { MutableRefObject } from 'react'

export const validateRef = <T,>(ref: MutableRefObject<T> | undefined | null):
  ref is MutableRefObject<Exclude<T, Falsey>> => !!ref?.current
