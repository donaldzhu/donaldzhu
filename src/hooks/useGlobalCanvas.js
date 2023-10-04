import { useRef } from 'react'
import { P5_EVENTS } from '../utils/p5Utils'

const useGlobalCanvas = () =>
  useRef(Object.fromEntries(P5_EVENTS.keys.map(e => [e, []])))

export default useGlobalCanvas