import { useEffect, useRef } from 'react'
import type { ForwardedRef } from 'react'

const useForwardedRef = <T>(ref: ForwardedRef<T>) => {
  const innerRef = useRef<T | null>(ref && typeof ref !== 'function' ? ref.current : null)

  useEffect(() => {
    if (!ref) return
    if (typeof ref === 'function') ref(innerRef.current)
    else ref.current = innerRef.current
  })

  return innerRef
}

export default useForwardedRef