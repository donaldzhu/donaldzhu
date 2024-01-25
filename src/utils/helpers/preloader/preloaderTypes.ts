import type { Breakpt, Device } from '../../breakptTypes'
import type { coorTuple } from '../../utilTypes'
import type { MediaStack } from './mediaStack'
import type { loadNativeVidType } from './preloadTypes'
import type { Fallback, MediaFileType, MediaSize } from './preloadUtils'
import type useVideoTest from '../../../hooks/useVideoTest'
import type useIsMobile from '../../../hooks/useIsMobile'

export interface MediaStackProps<K extends string> {
  fileName: string
  filePath: string
  fileType: MediaFileType
  device: Device
  breakpts: K[],
  config: PreloaderConfig,
  nativeDimension: coorTuple
  loadNativeVid: loadNativeVidType
}

export type PreloaderConfig = {
  isMobile: ReturnType<typeof useIsMobile>
} & ReturnType<typeof useVideoTest>

export type MediaBreakpts = Breakpt | Fallback | MediaSize.Max
export type PreloadMediaStack = MediaStack<MediaBreakpts>
