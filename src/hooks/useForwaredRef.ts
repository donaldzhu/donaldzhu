import _ from 'lodash'
import { ForwardedRef, useEffect, useRef } from 'react'

const useForwardedRef = <T>(ref: ForwardedRef<T>) => {
  const innerRef = useRef<T | null>(null)

  useEffect(() => {
    if (!ref) return _.noop
    if (typeof ref === 'function') ref(innerRef.current)
    else ref.current = innerRef.current
  })

  return innerRef
}

export default useForwardedRef