import { MutableRefObject } from 'react'
import p5 from 'p5'
import { P5Events } from '../../utils/p5Utils'
import useGlobalCanvas from '../../hooks/useGlobalCanvas'

export type canvasState = {
  mousePositionRef: MutableRefObject<null | [number, number]>
  hideCursorRef: MutableRefObject<boolean>
}

export type p5Callback = (p5: p5) => void
export type p5EventCallback = (p5: p5, evt?: Event | UIEvent) => void
export type p5EventHandlers = Record<P5Events, p5EventCallback>

export type sketchEventCallback = (p5: p5, canvasStateRefs: canvasState) => void
export type sketchEventHandler = Record<P5Events | 'setup', sketchEventCallback> & {
  cleanup: (canvasStateRefs: canvasState) => void
}


export type canvasRefType = ReturnType<typeof useGlobalCanvas>
export interface GlobalCanvasStates {
  canvasRef: canvasRefType
  canvasStateRefs: canvasState
}