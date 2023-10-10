import { useRef } from 'react'
import { P5_EVENTS } from '../utils/p5Utils'

const useGlobalCanvas = () =>
  useRef(Object.fromEntries(Object.keys(P5_EVENTS).map(e => [e, []])))

export default useGlobalCanvas