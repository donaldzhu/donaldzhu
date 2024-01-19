import type { Dispatch, ReactNode, SetStateAction } from 'react'
import type PreloadManager from '../../../utils/helpers/preloader/preloadManager'
import type { Device } from '../../../utils/breakptTypes'
import type { GlobalCanvasStates } from '../../common/canvas/canvasTypes'
import type { RequiredZoomMediaProps, handleZoomMediaType } from '../../common/media/mediaTypes'
import type useVideoTest from '../../../hooks/useVideoTest'

export type DesktopContextProps = {
  sidebar: ReactNode | undefined,
  setSidebar: Dispatch<SetStateAction<ReactNode>>,
  zoomMedia: RequiredZoomMediaProps | undefined,
  handleZoomMedia: handleZoomMediaType,
  preloadManager: PreloadManager
} & GlobalCanvasStates<Device.Desktop> &
  Omit<ReturnType<typeof useVideoTest>, 'canPlayWebm'>
