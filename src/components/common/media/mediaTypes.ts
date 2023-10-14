import { ForwardedRef, ImgHTMLAttributes, SyntheticEvent, VideoHTMLAttributes } from 'react'
import { ImgStack, MediaStack, VidStack } from '../../../utils/helpers/preloader/mediaStack'
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
  alt?: string,
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

export type ZoomMediaBaseProps = {
  src: string,
  width: string,
  isToolTip: boolean,
  mediaStack?: MediaStack
  fallbackPath: string
  getCurrentTime: () => number | undefined
  maxSize: string
}

export type ZoomImgProps = ZoomMediaBaseProps & ImgIntrinsicProps
export type ZoomVidProps = ZoomMediaBaseProps & VidIntrinsicProps
export type ZoomMediaProps = ZoomImgProps | ZoomVidProps