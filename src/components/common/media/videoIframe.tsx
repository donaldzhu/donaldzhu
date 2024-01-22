import styled from 'styled-components'
import { VideoIframeType } from './mediaTypes'
import type { IframeHTMLAttributes } from 'react'

interface VideoIframeProps {
  type: VideoIframeType,
  aspectRatio?: string
}

interface StyledVideoIframeProps {
  $aspectRatio: string | undefined
}

const VideoIframe = ({
  src,
  type,
  aspectRatio,
  ...rest
}: IframeHTMLAttributes<HTMLIFrameElement> & VideoIframeProps) => {
  const prefix = type === VideoIframeType.Youtube ?
    'https://www.youtube.com/embed/' :
    'https://player.vimeo.com/video/'
  return <Iframe
    {...rest}
    src={prefix + src}
    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
    allowFullScreen
    $aspectRatio={aspectRatio} />
}

const Iframe = styled.iframe<StyledVideoIframeProps>`
  width: 100%;
  aspect-ratio: ${({ $aspectRatio }) => $aspectRatio ?? '16 / 9'};
`

export default VideoIframe