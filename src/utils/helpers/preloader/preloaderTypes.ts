import type { Breakpt } from '../../queryUtil'
import type { coorTuple } from '../../utilTypes'
import type { MediaStack } from './mediaStack'
import type { loadVidType } from './preloadTypes'
import type { MediaSize } from './preloadUtils'
import type useCanAutoPlay from '../../../hooks/useCanAutoPlay'
import type useIsMobile from '../../../hooks/useIsMobile'

export interface MediaStackProps<K extends string> {
  fileName: string
  filePath: string
  breakpts: K[],
  config: { canAutoPlay: boolean | undefined },
  nativeDimension: coorTuple
  loadVid: loadVidType
}

export interface PreloadManagerConfig {
  canAutoPlay: ReturnType<typeof useCanAutoPlay>
  isMobile: ReturnType<typeof useIsMobile>
}

export type MediaBreakpts = Breakpt | MediaSize.DesktopFallback | MediaSize.Max
export type PreloadMediaStack = MediaStack<MediaBreakpts>
