import _ from 'lodash'
import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { useWindowSize } from '@uidotdev/usehooks'
import { domSizes } from '../../../styles/sizes'
import { addEventListener } from '../../../utils/reactUtils'
import { toPercent } from '../../../utils/sizeUtils'
import PopUpContainer from '../popUpContainer'
import { desktopQuery, mobileQuery } from '../../../utils/queryUtil'
import { validateString } from '../../../utils/commonUtils'
import mixins from '../../../styles/mixins'
import { Device } from '../../../utils/breakptTypes'
import useIsMobile from '../../../hooks/useIsMobile'
import { MediaFileType } from '../../../utils/helpers/preloader/preloadUtils'
import PreloadMedia from './preloadMedia'
import type { RequiredZoomMediaProps, handleZoomMediaType } from './mediaTypes'

interface ZoomedMediaProps {
  zoomMedia: RequiredZoomMediaProps
  handleUnzoom: handleZoomMediaType
}

interface StyledLoadingContainerProps {
  $mobileWidth: string | number | undefined
  $mobileHeight: string | number | undefined
  $aspectRatio: number | undefined
}

type StyledZoomedMediaProps = {
  $maxSize: string | number
  $isRendered: boolean
} & StyledLoadingContainerProps

const ZoomedMedia = ({ zoomMedia, handleUnzoom }: ZoomedMediaProps) => {
  const zoomedMediaRef = useRef<HTMLImageElement | HTMLVideoElement>(null)
  const [isRendered, setIsRendered] = useState(false)
  const isMobile = useIsMobile()
  const { width, height } = useWindowSize()

  useEffect(() => {
    const escListener = ({ key }: KeyboardEvent) => {
      if (key === 'Escape') handleUnzoom()
    }

    const currentMedia = zoomedMediaRef.current
    const zoomMediaIsVid = (zoomedMedia: HTMLElement):
      zoomedMedia is HTMLVideoElement => zoomedMedia.tagName === 'VIDEO'

    const removeKeydownListener =
      addEventListener(document, 'keydown', escListener)
    let removeRenderListener = _.noop

    if (!currentMedia) return removeKeydownListener

    if (zoomMediaIsVid(currentMedia)) {
      currentMedia.currentTime = zoomMedia.getCurrentTime()
      currentMedia.play()
      removeRenderListener = addEventListener(
        currentMedia, 'canplay', () => setIsRendered(true))
    } else {
      if (currentMedia.complete) setIsRendered(true)
      else removeRenderListener = addEventListener(
        currentMedia, 'load', () => setIsRendered(true))
    }

    return () => {
      removeKeydownListener()
      removeRenderListener()
    }
  }, [])

  useEffect(() => {
    if (isRendered) console.log(isRendered)
  }, [isRendered])

  const { type, mediaStack, fallbackPath, alt } = zoomMedia

  const maxSize = zoomMedia.maxSize ?? toPercent(domSizes[isMobile ?
    Device.Mobile : Device.Desktop].media.zoomPercentage)

  const { nativeDimension } = mediaStack?.stack ?? {}
  const aspectRatio = nativeDimension ? nativeDimension[0] / nativeDimension[1] : undefined
  const deviceRatio = width && height ? (width / height) : undefined
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
        stackData={mediaStack}
        fallbackPath={fallbackPath}
        alt={alt}
        ref={zoomedMediaRef}
        isZoomed={true}
        autoPlay={false} />
      {isMobile &&
        type === MediaFileType.Video &&
        !isRendered &&
        <LoadingContainer
          $aspectRatio={aspectRatio}
          $mobileWidth={mobileWidth}
          $mobileHeight={mobileHeight}>
          <p>
            Loading...
          </p>
        </LoadingContainer>}
    </ZoomedContainer>
  )
}


const mobileSizeMixin = () => ({
  $aspectRatio,
  $mobileWidth,
  $mobileHeight
}: StyledLoadingContainerProps) => `
  width: ${$mobileWidth};
  height: ${$mobileHeight};
  aspect-ratio: ${validateString($aspectRatio)};
`
const ZoomedContainer = styled(PopUpContainer) <StyledZoomedMediaProps>`
  background-color: rgba(0, 0, 0, 0.85);
  cursor: zoom-out;

  img, video {
    object-fit: contain;
    background-color: ${({ $isRendered }) => validateString(!$isRendered, 'white')};

    @media ${mobileQuery} {
      ${mobileSizeMixin}
    }

    @media ${desktopQuery} {
      ${({ $maxSize }) => mixins.squared($maxSize)}
    }
  }
`

const LoadingContainer = styled.div<StyledLoadingContainerProps>`
  position: absolute;

  ${mobileSizeMixin}
  ${mixins.flex('center', 'center')}
`

export default ZoomedMedia