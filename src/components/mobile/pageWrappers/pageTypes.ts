import type { TouchEvent } from 'react'
import type { GlobalCanvasStates } from '../../common/canvas/canvasTypes'
import type { Device } from '../../../utils/breakptTypes'
import type PreloadManager from '../../../utils/helpers/preloader/preloadManager'
import type { RequiredZoomMediaProps, handleZoomMediaType } from '../../common/media/mediaTypes'
import type useCanAutoPlay from '../../../hooks/useCanAutoPlay'

export type MobileContextProps = {
  shouldHideGyro: boolean,
  handleGyroButtonClick: (e: TouchEvent<HTMLButtonElement>) => void
  handleZoomMedia: handleZoomMediaType,
  preloadManager: PreloadManager,
  zoomMedia: RequiredZoomMediaProps | undefined,
} & GlobalCanvasStates<Device.Mobile> &
  ReturnType<typeof useCanAutoPlay>