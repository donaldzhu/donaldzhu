import { forwardRef, useContext, useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import styled from 'styled-components'
import { WorkPageContext } from '../../../contexts/context'
import mixins from '../../../styles/mixins'
import { joinPaths } from '../../../utils/commonUtils'
import useForwardedRef from '../../../hooks/useForwaredRef'
import { MediaFileType, MediaType, getFallbackKey, getStackBreakpt } from '../../../utils/helpers/preloader/preloadUtils'
import { percent, toPercent } from '../../../utils/sizeUtils'
import { mobileQuery } from '../../../utils/queryUtil'
import useIsMobile from '../../../hooks/useIsMobile'
import { ReactComponent as PlaySvg } from '../../../assets/mobile/play.svg'
import useMediaIsRendered from '../../../hooks/useMediaIsRendered'
import { noStackDataError } from '../../../utils/typeUtils'
import PreloadMedia from './preloadMedia'
import LoadingContainer from './loadingContainer'
import type { DesktopContextProps } from '../../desktop/pageWrappers/pageTypes'
import type { MobileContextProps } from '../../mobile/pageWrappers/pageTypes'
import type { MediaRef, ZoomMediaProps } from './mediaTypes'

interface StyledZoomMediaProps {
  $width: string | number | undefined
}
const ZoomMedia = forwardRef(function ZoomMedia(props: ZoomMediaProps, ref: MediaRef) {
  const { handleZoomMedia, zoomMedia, defaultCanAutoPlay, preloadManager } =
    useOutletContext<DesktopContextProps | MobileContextProps>()
  let { src } = props
  const { maxSize, width, isToolTip, ...rest } = props

  const isMobile = useIsMobile()
  const mobileNoAutoPlay = isMobile && !defaultCanAutoPlay
  // for when the video is played manually
  const [forceAutoPlay, setForceAutoPlay] = useState(!mobileNoAutoPlay)

  const { pageId } = useContext(WorkPageContext)
  const mediaRef = useForwardedRef(ref)
  const isRendered = useMediaIsRendered(mediaRef)

  useEffect(() => {
    if (!forceAutoPlay) setForceAutoPlay(!mobileNoAutoPlay)
  }, [isMobile, defaultCanAutoPlay])

  src = isToolTip ? joinPaths(MediaType.ToolTips, src) : src
  const stackData = preloadManager.findWorkMedia(pageId, src)
  if (!stackData) throw noStackDataError('ZoomMedia')

  const handleClick = () => {
    if (
      !forceAutoPlay &&
      defaultCanAutoPlay !== undefined &&
      rest.type === MediaFileType.Video
    ) return setForceAutoPlay(true)

    if (getStackBreakpt(stackData.stack) === getFallbackKey())
      return

    handleZoomMedia({
      ...props,
      stackData,
      getCurrentTime: () => (
        (
          'current' in mediaRef &&
          mediaRef.current &&
          'currentTime' in mediaRef.current
        ) ? mediaRef.current.currentTime : undefined
      ) ?? 0,
      maxSize: typeof maxSize === 'number' ? toPercent(maxSize) : maxSize
    })
  }

  return (
    <MediaContainer $width={width}>
      <PreloadMedia
        {...rest}
        {...(rest.type !== MediaFileType.Video ? {} : {
          canAutoPlay: (mobileNoAutoPlay ? forceAutoPlay :
            preloadManager.imgPreloaded !== false) &&
            (!isMobile || !zoomMedia)
        })}
        stackData={stackData}
        ref={mediaRef}
        isZoomed={false}
        onClick={handleClick} />
      {
        defaultCanAutoPlay === false &&
        rest.type === MediaFileType.Video && (
          !forceAutoPlay ?
            <div><PlaySvg /></div> :
            !isRendered && <LoadingContainer />
        )
      }
    </MediaContainer>
  )
})

const MediaContainer = styled.div<StyledZoomMediaProps>`
  ${mixins.flex('center', 'center')}
  width: 100%;

  img, video {
    cursor: zoom-in;
    object-fit: cover;
    width: ${({ $width }: StyledZoomMediaProps) => $width ?? percent(100)};

    @media ${mobileQuery} {
      padding-bottom: 2vw;
    }
  }

  > div {
    ${mixins.flex('center', 'center')}
    width: ${({ $width }: StyledZoomMediaProps) => $width ?? percent(100)};
    position: absolute;
    pointer-events: none;

    svg {
      color: rgba(0, 0, 0, 0.65);
      width: 13.5%;
    }
  }
`


export default ZoomMedia