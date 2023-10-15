import { MutableRefObject } from 'react'
import p5 from 'p5'
import { P5Event } from '../../utils/p5Utils'
import useGlobalCanvas from '../../hooks/useGlobalCanvas'

export interface CanvasState {
  mousePositionRef: MutableRefObject<null | [number, number]>
  hideCursorRef: MutableRefObject<boolean>
}

export type p5Callback = (p5: p5) => void
export type p5EventCallback = (p5: p5, evt?: Event | UIEvent) => void
export type P5EventHandlers = Record<P5Event, p5EventCallback>

export type sketchEventCallback = (p5: p5, canvasStateRefs: CanvasState) => void
export type SketchEventHandler = Record<P5Event | 'setup', sketchEventCallback> & {
  cleanup: (canvasStateRefs: CanvasState) => void
}


export type CanvasRefType = ReturnType<typeof useGlobalCanvas>
export interface GlobalCanvasStates {
  canvasRef: CanvasRefType
  canvasStateRefs: CanvasState
}