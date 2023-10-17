import { CanvasRefType } from '../canvas/canvasTypes'

export interface PageMobileContext {
  mobile: {
    log: (...content: any[]) => void
  }
  canAutoPlay: boolean | undefined
  canvasRef: CanvasRefType
}