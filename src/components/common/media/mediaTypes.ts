import type { ForwardedRef, ImgHTMLAttributes, SyntheticEvent, VideoHTMLAttributes } from 'react'
import type { MediaFileType } from '../../../utils/helpers/preloader/preloadUtils'
import type { PreloadMediaStack } from '../../../utils/helpers/preloader/preloaderTypes'
import type { TypedPreloadStack } from '../../../utils/helpers/preloader/preloadManager'

interface MediaProps {
  hasLoaded?: boolean
  aspectRatio?: string | number
  isZoomed?: boolean
}

export interface StyledMediaProps {
  $hasLoaded?: boolean
  $aspectRatio?: string | number
  $isZoomed?: boolean
}

export type ImgProps = MediaProps

export type VidProps = {
  alt?: string | undefined,
  canAutoPlay?: boolean | undefined
  useNativeControl?: boolean
  currentTime?: number
} & MediaProps

export enum VideoIframeType {
  Youtube,
  Vimeo
}

type ImgIntrinsicProps =
  Partial<ImgHTMLAttributes<HTMLImageElement>> &
  Partial<SyntheticEvent<HTMLImageElement>> &
  ImgProps &
  { type: MediaFileType.Image }

type VidIntrinsicProps =
  Partial<VideoHTMLAttributes<HTMLVideoElement>> &
  Partial<SyntheticEvent<HTMLVideoElement>> &
  VidProps &
  { type: MediaFileType.Video }

export type MediaIntrinsicProps = ImgIntrinsicProps | VidIntrinsicProps

type MediaElement = HTMLImageElement | HTMLVideoElement
export type MediaRef = ForwardedRef<MediaElement>

interface PreloadMediaBaseProps {
  stackData: TypedPreloadStack
  isZoomed?: boolean
  autoPlay?: boolean
}

export type PreloadMediaProps = MediaIntrinsicProps & PreloadMediaBaseProps

type ZoomMediaBaseProps<R extends boolean = false> = R extends true ? {
  src: string,
  width?: string,
  isToolTip?: boolean,
  stackData: TypedPreloadStack
  getCurrentTime: () => number
  currentTime?: boolean
  maxSize?: string | number | undefined
} : {
  src: string,
  width?: string,
  isToolTip?: boolean,
  stackData?: PreloadMediaStack
  getCurrentTime?: () => number
  currentTime?: boolean
  maxSize?: string | number
}

export type handleZoomMediaType = (media?: RequiredZoomMediaProps) => void


type ZoomImgProps<R extends boolean = false> = ZoomMediaBaseProps<R> & ImgIntrinsicProps
type ZoomVidProps<R extends boolean = false> = ZoomMediaBaseProps<R> & VidIntrinsicProps
export type ZoomMediaProps<R extends boolean = false> = ZoomImgProps<R> | ZoomVidProps<R>
export type RequiredZoomMediaProps = ZoomMediaProps<true>
export type WorkImgProps = Omit<ZoomImgProps, 'type'>
export type WorkVidProps = Omit<ZoomVidProps, 'type'>