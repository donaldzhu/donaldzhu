import type { RefObject, TouchEvent } from 'react'
import type { GlobalCanvasStates } from '../../common/canvas/canvasTypes'
import type { Device } from '../../../utils/breakptTypes'
import type PreloadManager from '../../../utils/helpers/preloader/preloadManager'
import type { RequiredZoomMediaProps, handleZoomMediaType } from '../../common/media/mediaTypes'
import type useVideoTest from '../../../hooks/useVideoTest'

export type MobileContextProps = {
  shouldHideGyro: boolean,
  handleGyroButtonClick: (e: TouchEvent<HTMLButtonElement>) => void
  handleZoomMedia: handleZoomMediaType,
  preloadManager: PreloadManager,
  headerRef: RefObject<HTMLHeadElement>
  zoomMedia: RequiredZoomMediaProps | undefined,
} & GlobalCanvasStates<Device.Mobile> &
  Omit<ReturnType<typeof useVideoTest>, 'canPlayWebm'>