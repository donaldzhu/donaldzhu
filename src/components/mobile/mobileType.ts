import { CanvasRefType, CanvasState } from '../canvas/canvasTypes'

export interface PageMobileContext {
  canAutoPlay: boolean | undefined
  canvasRef: CanvasRefType,
  canvasStates: CanvasState
}