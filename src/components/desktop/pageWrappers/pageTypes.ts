import type { Dispatch, ReactNode, SetStateAction } from 'react'
import type PreloadManager from '../../../utils/helpers/preloader/preloadManager'
import type { Device } from '../../../utils/breakptTypes'
import type { GlobalCanvasStates } from '../../common/canvas/canvasTypes'
import type { RequiredZoomMediaProps, handleZoomMediaType } from '../../common/media/mediaTypes'

export type DesktopContextProps = {
  defaultCanAutoPlay: boolean | undefined,
  sidebar: ReactNode | undefined,
  setSidebar: Dispatch<SetStateAction<ReactNode>>,
  zoomMedia: RequiredZoomMediaProps | undefined,
  handleZoomMedia: handleZoomMediaType,
  preloadManager: PreloadManager,
  canAutoPlay: boolean | undefined,
} & GlobalCanvasStates<Device.Desktop>
