import { useEffect, useRef } from 'react'

const useMemoRef = <T, D>(factory: () => T, dependencies: D[] = []) => {
  const ref = useRef<T>()
  useEffect(() => { ref.current = factory() }, dependencies)
  return ref
}

export default useMemoRef