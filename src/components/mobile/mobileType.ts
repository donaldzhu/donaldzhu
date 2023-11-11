import { TouchEvent } from 'react'
import { CanvasRefType, MobileCanvasStates } from '../canvas/canvasTypes'

export interface PageMobileContext {
  canAutoPlay: boolean | undefined
  canvasRef: CanvasRefType,
  canvasStates: Required<MobileCanvasStates>,
  shouldHideGyro: boolean,
  handleGyroButtonClick: (e: TouchEvent<HTMLButtonElement>) => void
}