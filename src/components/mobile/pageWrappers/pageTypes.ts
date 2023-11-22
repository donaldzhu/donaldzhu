import type { TouchEvent } from 'react'
import type { GlobalCanvasStates } from '../../common/canvas/canvasTypes'
import type { Device } from '../../../utils/queryUtil'

export type MobileContextProps = {
  shouldHideGyro: boolean,
  handleGyroButtonClick: (e: TouchEvent<HTMLButtonElement>) => void
  canAutoPlay: boolean | undefined
} & GlobalCanvasStates<Device.mobile>