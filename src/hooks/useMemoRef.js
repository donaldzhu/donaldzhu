import { useEffect, useRef } from 'react'

const useMemoRef = (factory, dependencies = []) => {
  const ref = useRef(factory())
  useEffect(() => { ref.current = factory() }, [...dependencies])
  return ref
}

export default useMemoRef