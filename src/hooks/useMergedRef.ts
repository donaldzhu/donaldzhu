import { MutableRefObject, useEffect, useRef } from 'react'
import { filterFalsy } from '../utils/commonUtils'

const useMergedRef = <T>(...refs: (MutableRefObject<T | null> | undefined)[]) => {
  const filteredRefs = filterFalsy(refs)
  const mergedRef = useRef<T | null>(null)
  useEffect(() => {
    filteredRefs.forEach(ref => ref.current = mergedRef.current)
  }, [mergedRef])
  return mergedRef
}

export default useMergedRef