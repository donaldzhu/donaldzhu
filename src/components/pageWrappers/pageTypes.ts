import { Dispatch, ReactNode, SetStateAction } from 'react'
import PreloadManager from '../../utils/helpers/preloader/preloadManager'
import { GlobalCanvasStates } from '../canvas/canvasTypes'
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

export interface PageProps {
  canAutoPlay: boolean | undefined
}