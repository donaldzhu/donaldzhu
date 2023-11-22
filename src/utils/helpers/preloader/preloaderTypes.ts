import type { Breakpt } from '../../queryUtil'
import type { coorTuple } from '../../utilTypes'
import type { loadVidType } from './preloadTypes'
import type { MediaSize, MediaType } from './preloadUtils'

export interface MediaStackProps {
  pageId: string
  fileName: string
  mediaType: MediaType
  autoPlayConfig: { canAutoPlay: boolean | undefined },
  loadVid: loadVidType,
  nativeDimension: coorTuple
}

export type PreloadBreakpt = Breakpt | MediaSize.DesktopFallback | MediaSize.Max