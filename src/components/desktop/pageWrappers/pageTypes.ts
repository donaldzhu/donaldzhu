import type { Dispatch, ReactNode, SetStateAction } from 'react'
import type PreloadManager from '../../../utils/helpers/preloader/preloadManager'
import type { Device } from '../../../utils/queryUtil'
import type { GlobalCanvasStates } from '../../common/canvas/canvasTypes'
import type { RequiredZoomMediaProps } from '../../common/media/mediaTypes'

export type DesktopContextProps = {
  sidebar: ReactNode | undefined,
  setSidebar: Dispatch<SetStateAction<ReactNode>>,
  zoomMedia: RequiredZoomMediaProps | undefined,
  handleZoomMedia: (zoomMedia: RequiredZoomMediaProps | undefined) => void,
  preloadManager: PreloadManager,

  canAutoPlay: boolean | undefined,
} & GlobalCanvasStates<Device.desktop>

export type handleZoomType = (media?: RequiredZoomMediaProps) => void

export interface PageProps {
  canAutoPlay: boolean | undefined
}