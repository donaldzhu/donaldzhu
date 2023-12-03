import type { Breakpt } from '../../breakptTypes'
import type { coorTuple } from '../../utilTypes'
import type { MediaStack } from './mediaStack'
import type { loadVidType } from './preloadTypes'
import type { Fallback, MediaSize } from './preloadUtils'
import type useCanAutoPlay from '../../../hooks/useCanAutoPlay'
import type useIsMobile from '../../../hooks/useIsMobile'

export interface MediaStackProps<K extends string> {
  fileName: string
  filePath: string
  breakpts: K[],
  config: PreloaderConfig,
  nativeDimension: coorTuple
  loadVid: loadVidType
}

export type PreloaderConfig = {
  isMobile: ReturnType<typeof useIsMobile>
} & ReturnType<typeof useCanAutoPlay>

export type MediaBreakpts = Breakpt | Fallback | MediaSize.Max
export type PreloadMediaStack = MediaStack<MediaBreakpts>
