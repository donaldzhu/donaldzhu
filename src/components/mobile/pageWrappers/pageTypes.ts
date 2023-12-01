import type { TouchEvent } from 'react'
import type { GlobalCanvasStates } from '../../common/canvas/canvasTypes'
import type { Device } from '../../../utils/breakptTypes'
import type PreloadManager from '../../../utils/helpers/preloader/preloadManager'
import type { handleZoomMediaType } from '../../common/media/mediaTypes'

export type MobileContextProps = {
  shouldHideGyro: boolean,
  handleGyroButtonClick: (e: TouchEvent<HTMLButtonElement>) => void
  handleZoomMedia: handleZoomMediaType,
  preloadManager: PreloadManager,
  canAutoPlay: boolean | undefined,
} & GlobalCanvasStates<Device.Mobile>