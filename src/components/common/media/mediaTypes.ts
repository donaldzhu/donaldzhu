export interface MediaProps {
  hasLoaded: boolean
  aspectRatio: string
}

export interface StyledMediaProps {
  $hasLoaded: boolean
  $aspectRatio: string
}

export type ImgProps = MediaProps

export type VidProps = {
  alt: string,
} & MediaProps

export enum VideoIframeType {
  Youtube,
  Vimeo
}