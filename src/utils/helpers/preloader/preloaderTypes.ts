import type { Breakpt } from '../../queryUtil'
import type { coorTuple } from '../../utilTypes'
import type { MediaStack } from './mediaStack'
import type { loadVidType } from './preloadTypes'
import type { MediaSize } from './preloadUtils'

export interface MediaStackProps<K extends string> {
  pageId: string
  fileName: string
  filePath: string
  breakpts: K[],
  autoPlayConfig: { canAutoPlay: boolean | undefined },
  nativeDimension: coorTuple
  loadVid: loadVidType
}

export type MediaBreakpts = Breakpt | MediaSize.DesktopFallback | MediaSize.Max
export type PreloadMediaStack = MediaStack<MediaBreakpts>
