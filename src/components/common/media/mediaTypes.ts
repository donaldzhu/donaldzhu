import { ForwardedRef, ImgHTMLAttributes, SyntheticEvent, VideoHTMLAttributes } from 'react'
import { ImgStack, VidStack } from '../../../utils/helpers/preloader/mediaStack'
import { MediaFileType } from '../../../utils/helpers/preloader/preloadUtils'

export interface MediaProps {
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
} & MediaProps

export enum VideoIframeType {
  Youtube,
  Vimeo
}

export type ImgIntrinsicProps =
  Partial<ImgHTMLAttributes<HTMLImageElement>> &
  Partial<SyntheticEvent<HTMLImageElement>> &
  ImgProps &
  { type: MediaFileType.Image }

export type VidIntrinsicProps =
  Partial<VideoHTMLAttributes<HTMLVideoElement>> &
  Partial<SyntheticEvent<HTMLVideoElement>> &
  VidProps &
  { type: MediaFileType.Video }

export type MediaIntrinsicProps = ImgIntrinsicProps | VidIntrinsicProps

export type MediaElement = HTMLImageElement | HTMLVideoElement
export type MediaRef = ForwardedRef<MediaElement>

export interface PreloadMediaBaseProps {
  mediaStack?: ImgStack | VidStack
  fallbackPath: string
  isZoomed?: boolean
  autoPlay?: boolean
}
export type PreloadImgProps = ImgIntrinsicProps
export type PreloadVidProps = VidIntrinsicProps
export type PreloadMediaProps = (PreloadImgProps | PreloadVidProps) & PreloadMediaBaseProps

export type ZoomMediaBaseProps<R extends boolean = false> = R extends true ? {
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

export type ZoomImgProps<R extends boolean = false> = ZoomMediaBaseProps<R> & ImgIntrinsicProps
export type ZoomVidProps<R extends boolean = false> = ZoomMediaBaseProps<R> & VidIntrinsicProps
export type ZoomMediaProps<R extends boolean = false> = ZoomImgProps<R> | ZoomVidProps<R>
export type RequiredZoomMediaProps = ZoomMediaProps<true>
export type WorkImgProps = Omit<ZoomImgProps, 'type'>
export type WorkVidProps = Omit<ZoomVidProps, 'type'>