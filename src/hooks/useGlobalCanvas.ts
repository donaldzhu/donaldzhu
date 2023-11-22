import { useRef } from 'react'
import { typedKeys } from '../utils/commonUtils'
import { P5Event } from '../utils/p5Utils'
import type { p5EventCallback } from '../components/common/canvas/canvasTypes'

const useGlobalCanvas = () => {
  const entries = typedKeys<P5Event>(P5Event)
  const mappedEntries: [P5Event, p5EventCallback[]][] =
    entries.map(e => [e, [] satisfies p5EventCallback[]])
  const canvas = Object.fromEntries<p5EventCallback[]>(mappedEntries) as
    Record<P5Event, p5EventCallback[]>
  return useRef(canvas)
}

export default useGlobalCanvas