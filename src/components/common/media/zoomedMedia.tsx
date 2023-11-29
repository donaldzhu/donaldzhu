import _ from 'lodash'
import { useEffect, useRef } from 'react'
import styled from 'styled-components'
import mixins from '../../../styles/mixins'
import { domSizes } from '../../../styles/sizes'
import { addEventListener } from '../../../utils/reactUtils'
import { toPercent } from '../../../utils/sizeUtils'
import PopUpContainer from '../popUpContainer'
import PreloadMedia from './preloadMedia'
import type { handleZoomType } from '../../desktop/pageWrappers/pageTypes'
import type { RequiredZoomMediaProps } from './mediaTypes'

interface ZoomedMediaProps {
  zoomMedia: RequiredZoomMediaProps
  handleUnzoom: handleZoomType
}

interface StyledZoomedMediaProps {
  $maxSize: string | number | undefined
}

const ZoomedMedia = ({ zoomMedia, handleUnzoom }: ZoomedMediaProps) => {
  const zoomedMediaRef = useRef<HTMLImageElement | HTMLVideoElement>(null)

  useEffect(() => {
    const escListener = ({ key }: KeyboardEvent) => {
      if (key === 'Escape') handleUnzoom()
    }

    const currentZoomedMedia = zoomedMediaRef.current
    function zoomMediaIsVid(zoomedMedia: HTMLElement): zoomedMedia is HTMLVideoElement {
      return zoomedMedia.tagName === 'VIDEO'
    }
    if (zoomMedia && currentZoomedMedia && zoomMediaIsVid(currentZoomedMedia)) {
      currentZoomedMedia.currentTime = zoomMedia.getCurrentTime()
      currentZoomedMedia.play()
    }

    return zoomMedia ? addEventListener(document, 'keydown', escListener) : _.noop
  }, [])

  const { maxSize, type, mediaStack, fallbackPath, alt } = zoomMedia
  return (
    <ZoomedContainer
      $maxSize={maxSize}
      onClick={() => handleUnzoom()}>
      <PreloadMedia
        type={type}
        stackData={mediaStack}
        fallbackPath={fallbackPath}
        alt={alt}
        ref={zoomedMediaRef}
        isZoomed={true}
        autoPlay={false} />
    </ZoomedContainer>
  )
}

const ZoomedContainer = styled(PopUpContainer) <StyledZoomedMediaProps>`
  background-color: rgba(0, 0, 0, 0.85);
  cursor: zoom-out;

  img, video {
    object-fit: contain;
    ${({ $maxSize }) => mixins.squared($maxSize ?? toPercent(domSizes.desktop.media.zoomPercentage))}
  }
`


export default ZoomedMedia