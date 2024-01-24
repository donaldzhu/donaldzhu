import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { domSizes } from '../../../styles/sizes'
import { addEventListener } from '../../../utils/reactUtils'
import { toPercent } from '../../../utils/sizeUtils'
import PopUpContainer from '../popUpContainer'
import { validateString } from '../../../utils/commonUtils'
import { Device } from '../../../utils/breakptTypes'
import useIsMobile from '../../../hooks/useIsMobile'
import { MediaFileType } from '../../../utils/helpers/preloader/preloadUtils'
import useWindowSize from '../../../hooks/useWindowSize'
import useMediaIsRendered from '../../../hooks/useMediaIsRendered'
import PreloadMedia from './preloadMedia'
import LoadingContainer from './loadingContainer'
import type { RequiredZoomMediaProps, handleZoomMediaType } from './mediaTypes'

interface ZoomedMediaProps {
  zoomMedia: RequiredZoomMediaProps
  canAutoPlay: boolean | undefined
  handleUnzoom: handleZoomMediaType
}

interface StyledZoomedMediaProps {
  $maxSize: string | number
  $isRendered: boolean
  $mobileWidth: string | number | undefined
  $mobileHeight: string | number | undefined
  $aspectRatio: number | undefined
}

const ZoomedMedia = ({ zoomMedia, canAutoPlay, handleUnzoom }: ZoomedMediaProps) => {
  const [hasLoadedGracefully, setHasLoadedGracefully] = useState(false)
  const zoomedMediaRef = useRef<HTMLImageElement | HTMLVideoElement>(null)
  const isRendered = useMediaIsRendered(zoomedMediaRef)
  const isMobile = useIsMobile()
  const { width, height } = useWindowSize()

  useEffect(() => {
    const escListener = ({ key }: KeyboardEvent) => {
      if (key === 'Escape') handleUnzoom()
    }

    const currentMedia = zoomedMediaRef.current
    const removeKeydownListener =
      addEventListener(document, 'keydown', escListener)

    if (!currentMedia) return removeKeydownListener
    const zoomMediaIsVid = (zoomedMedia: HTMLElement):
      zoomedMedia is HTMLVideoElement => zoomedMedia.tagName === 'VIDEO'

    if (!zoomMediaIsVid(currentMedia))
      return removeKeydownListener

    setTimeout(() => { setHasLoadedGracefully(true) }, 500)
    return removeKeydownListener
  }, [])

  const { type, stackData, alt } = zoomMedia

  const maxSize = zoomMedia.maxSize ?? toPercent(domSizes[isMobile ?
    Device.Mobile : Device.Desktop].media.zoomPercentage)

  const { nativeDimension } = stackData.stack
  const aspectRatio = nativeDimension[0] / nativeDimension[1]
  const deviceRatio = width / height
  const isWider = aspectRatio && deviceRatio && aspectRatio >= deviceRatio
  const mobileWidth = isWider ? maxSize : ''
  const mobileHeight = !isWider ? maxSize : ''

  return (
    <ZoomedContainer
      $maxSize={maxSize}
      $isRendered={isRendered}
      $aspectRatio={aspectRatio}
      $mobileWidth={mobileWidth}
      $mobileHeight={mobileHeight}
      onClick={() => handleUnzoom()}>
      <PreloadMedia
        type={type}
        stackData={stackData}
        alt={alt}
        ref={zoomedMediaRef}
        isZoomed={true}
        autoPlay={true}
        canAutoPlay={canAutoPlay}
        currentTime={!isMobile ? zoomMedia.getCurrentTime() : undefined} />
      {
        hasLoadedGracefully &&
        isMobile &&
        type === MediaFileType.Video &&
        !isRendered &&
        <LoadingContainer />
      }
    </ZoomedContainer>
  )
}


const ZoomedContainer = styled(PopUpContainer) <StyledZoomedMediaProps>`
  background-color: rgba(0, 0, 0, 0.85);
  cursor: zoom-out;

  img, video {
    ${({ $aspectRatio, $mobileWidth, $mobileHeight }) => `
      width: ${$mobileWidth};
      height: ${$mobileHeight};
      aspect-ratio: ${validateString($aspectRatio)};
    `}

    object-fit: fill;
    ${({ $isRendered }) => validateString(!$isRendered, 'background: white;')}
  }
`

export default ZoomedMedia