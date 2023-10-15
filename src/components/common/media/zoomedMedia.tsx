import { useEffect, useRef } from 'react'
import { styled } from 'styled-components'
import _ from 'lodash'
import PreloadMedia from './preloadMedia'
import { addEventListener } from '../../../utils/reactUtils'
import { toPercent } from '../../../utils/sizeUtils'
import mixins from '../../../styles/mixins'
import { domSizes } from '../../../styles/sizes'
import PopUpContainer from '../popUpContainer'
import { handleZoomType } from '../../pageWrappers/pageTypes'
import { RequiredZoomMediaProps } from './mediaTypes'

interface ZoomedMediaProps {
  zoomMedia: RequiredZoomMediaProps
  handleUnzoom: handleZoomType
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
        mediaStack={mediaStack}
        fallbackPath={fallbackPath}
        alt={alt}
        ref={zoomedMediaRef}
        isZoomed={true}
        autoPlay={false} />
    </ZoomedContainer>
  )
}

const ZoomedContainer = styled(PopUpContainer) <{ $maxSize: string | number | undefined }>`
  background-color: rgba(0, 0, 0, 0.85);
  cursor: zoom-out;

  img, video {
    object-fit: contain;
    ${({ $maxSize }) => mixins.squared($maxSize || toPercent(domSizes.media.zoomPercentage))}
  }
`


export default ZoomedMedia