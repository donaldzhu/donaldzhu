import { ImgHTMLAttributes, SyntheticEvent, VideoHTMLAttributes } from 'react'
import { ImgStack, MediaStack, VidStack } from '../../../utils/helpers/preloader/mediaStack'
import { MediaFileType } from '../../../utils/helpers/preloader/preloadUtils'

export interface MediaProps {
  hasLoaded?: boolean
  aspectRatio?: string | number | undefined
}

export interface StyledMediaProps {
  $hasLoaded?: boolean
  $aspectRatio?: string | number | undefined
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

export interface PreloadMediaBaseProps<T extends ImgStack | VidStack> {
  mediaStack: T
  fallbackPath: string
  isZoomed?: boolean
  autoPlay?: boolean
}
export type PreloadImgProps = ImgIntrinsicProps & PreloadMediaBaseProps<ImgStack>
export type PreloadVidProps = VidIntrinsicProps & PreloadMediaBaseProps<VidStack>
export type PreloadMediaProps = PreloadImgProps | PreloadVidProps


export type ZoomMediaBaseProps = {
  src: string,
  width: string,
  isToolTip: boolean,
  mediaStack: MediaStack
  fallbackPath: string
  getCurrentTime: () => number
  maxSize: string
}

export type ZoomImgProps = ZoomMediaBaseProps & ImgIntrinsicProps
export type ZoomVidProps = ZoomMediaBaseProps & VidIntrinsicProps
export type ZoomMediaProps = ZoomImgProps | ZoomVidProps