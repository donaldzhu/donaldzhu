import type { ForwardedRef, ImgHTMLAttributes, SyntheticEvent, VideoHTMLAttributes } from 'react'
import type { ImgStack, VidStack } from '../../../utils/helpers/preloader/mediaStack'
import type { MediaFileType } from '../../../utils/helpers/preloader/preloadUtils'

interface MediaProps {
  hasLoaded?: boolean
  aspectRatio?: string | number
}

export interface StyledMediaProps {
  $hasLoaded?: boolean
  $aspectRatio?: string | number
}

export type ImgProps = MediaProps

export type VidProps = {
  alt?: string | undefined,
  canAutoPlay?: boolean | undefined
  useNativeControl?: boolean
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
  mediaStack?: ImgStack | VidStack
  fallbackPath: string
  isZoomed?: boolean
  autoPlay?: boolean
}
type PreloadImgProps = ImgIntrinsicProps
type PreloadVidProps = VidIntrinsicProps
export type PreloadMediaProps = (PreloadImgProps | PreloadVidProps) & PreloadMediaBaseProps

type ZoomMediaBaseProps<R extends boolean = false> = R extends true ? {
  src: string,
  width?: string,
  isToolTip?: boolean,
  mediaStack?: ImgStack | VidStack
  fallbackPath: string
  getCurrentTime: () => number
  maxSize?: string | number | undefined
} : {
  src: string,
  width?: string,
  isToolTip?: boolean,
  mediaStack?: ImgStack | VidStack
  fallbackPath?: string
  getCurrentTime?: () => number
  maxSize?: string | number
}

type ZoomImgProps<R extends boolean = false> = ZoomMediaBaseProps<R> & ImgIntrinsicProps
type ZoomVidProps<R extends boolean = false> = ZoomMediaBaseProps<R> & VidIntrinsicProps
export type ZoomMediaProps<R extends boolean = false> = ZoomImgProps<R> | ZoomVidProps<R>
export type RequiredZoomMediaProps = ZoomMediaProps<true>
export type WorkImgProps = Omit<ZoomImgProps, 'type'>
export type WorkVidProps = Omit<ZoomVidProps, 'type'>