import { TouchEvent } from 'react'
import { GlobalCanvasStates } from '../canvas/canvasTypes'
import { Device } from '../../utils/queryUtil'

export type PageMobileContextProps = {
  shouldHideGyro: boolean,
  handleGyroButtonClick: (e: TouchEvent<HTMLButtonElement>) => void

  canAutoPlay: boolean | undefined
} & GlobalCanvasStates<Device.mobile>