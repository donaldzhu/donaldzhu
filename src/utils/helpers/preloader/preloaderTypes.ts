import { Breakpt } from '../../queryUtil'
import { coorTuple } from '../../utilTypes'
import { loadVidType } from './preloadTypes'
import { MediaSize, MediaType } from './preloadUtils'

export interface MediaStackProps {
  pageId: string
  fileName: string
  mediaType: MediaType
  autoPlayConfig: { canAutoPlay: boolean | undefined },
  loadVid: loadVidType,
  nativeDimension: coorTuple
}

export type PreloadBreakpt = Breakpt | MediaSize.DesktopFallback | MediaSize.Max