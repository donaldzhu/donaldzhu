import { useEffect, useRef } from 'react'

const useAnimate = <T>(callback: () => void, dependencies: T[]) => {
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