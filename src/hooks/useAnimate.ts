import { DependencyList, useEffect, useRef } from 'react'

const useAnimate = (callback: () => void, dependencies: DependencyList = []) => {
  const requestRef = useRef<number>()
  const animate = () => {
    callback()
    requestAnimationFrame(animate)
  }

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate)
    return () => {
      if (requestRef.current)
        cancelAnimationFrame(requestRef.current)
    }
  }, dependencies)
}

export default useAnimate