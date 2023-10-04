import { styled } from 'styled-components'

const VideoIframe = props => {
  const { src, type, aspectRatio, ...rest } = props
  const prefix = type === 'youtube' ? 'https://www.youtube.com/embed/' :
    type === 'vimeo' ? 'https://player.vimeo.com/video/' : ''
  return <Iframe
    {...rest}
    src={prefix + src}
    frameBorder='0'
    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
    allowFullScreen
    $aspectRatio={aspectRatio} />
}

const Iframe = styled.iframe`
  width: 100%;
  aspect-ratio: ${({ $aspectRatio }) => $aspectRatio || '16 / 9'};
`

export default VideoIframe