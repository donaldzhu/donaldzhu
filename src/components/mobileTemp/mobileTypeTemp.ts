import type { TouchEvent } from 'react'
import type { CanvasRefType, MobileCanvasStates } from '../common/canvas/canvasTypes'

export interface PageMobileContextTemp {
  canAutoPlay: boolean | undefined
  canvasRef: CanvasRefType,
  canvasStates: Required<MobileCanvasStates>,
  handleGyroButtonClick: (e: TouchEvent<HTMLButtonElement>) => void
}