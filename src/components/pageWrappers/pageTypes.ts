import { Dispatch, ReactNode, SetStateAction } from 'react'
import { GlobalCanvasStates } from '../canvas/canvasTypes'
import PreloadManager from '../../utils/helpers/preloader/preloadManager'
import { RequiredZoomMediaProps } from '../common/media/mediaTypes'

export type PageContextProps = {
  sidebar: ReactNode | undefined,
  setSidebar: Dispatch<SetStateAction<ReactNode>>,
  zoomMedia: RequiredZoomMediaProps | undefined,
  handleZoomMedia: (zoomMedia: RequiredZoomMediaProps | undefined) => void,
  canAutoPlay: boolean | undefined,
  preloadManager: PreloadManager
} & GlobalCanvasStates

export type handleZoomType = (media?: RequiredZoomMediaProps) => void