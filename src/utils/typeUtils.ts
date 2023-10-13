import { MutableRefObject } from 'react'
import { Falsey } from 'lodash'

export const validateRef = <T,>(ref: MutableRefObject<T>):
  ref is MutableRefObject<Exclude<T, Falsey>> => !!ref.current
