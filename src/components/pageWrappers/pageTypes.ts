import { Dispatch, ReactNode, SetStateAction } from 'react'
import { GlobalCanvasStates } from '../canvas/canvasTypes'
import PreloadManager from '../../utils/helpers/preloader/preloadManager'
import { ZoomMediaProps } from '../common/media/mediaTypes'

export type ContextInterface = {
  sidebar: ReactNode | undefined,
  setSidebar: Dispatch<SetStateAction<ReactNode>>,
  zoomMedia: ZoomMediaProps | undefined,
  handleZoomMedia: (zoomMedia: ZoomMediaProps) => void,
  canAutoPlay: boolean | undefined,
  preloadManager: PreloadManager
} & GlobalCanvasStates