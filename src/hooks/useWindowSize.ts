import { useLayoutEffect, useState } from 'react'
import { addEventListener } from '../utils/reactUtils'

const useWindowSize = () => {
  const getSize = () => ({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  const [size, setSize] = useState(getSize())

  useLayoutEffect(() =>
    addEventListener(window, 'resize',
      () => setSize(getSize())), [])

  return size
}

export default useWindowSize