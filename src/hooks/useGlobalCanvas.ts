import { useRef } from 'react'
import { P5Events } from '../utils/p5Utils'
import { typedKeys } from '../utils/commonUtils'
import { p5EventCallback } from '../components/canvas/canvasTypes'

const useGlobalCanvas = () => {
  const entries = typedKeys<P5Events>(P5Events)
  const mappedEntries: [P5Events, p5EventCallback[]][] = entries.map(e => [e, [] as p5EventCallback[]])
  const canvas = Object.fromEntries<p5EventCallback[]>(mappedEntries) as Record<P5Events, p5EventCallback[]>
  return useRef(canvas)
}

export default useGlobalCanvas