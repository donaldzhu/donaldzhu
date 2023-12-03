import { forwardRef, useContext, useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import styled from 'styled-components'
import { WorkPageContext } from '../../../contexts/context'
import mixins from '../../../styles/mixins'
import { getDevice, joinPaths } from '../../../utils/commonUtils'
import useForwardedRef from '../../../hooks/useForwaredRef'
import { MediaFileType, MediaSize, MediaType, getFallbackKey, getStackBreakpt } from '../../../utils/helpers/preloader/preloadUtils'
import { percent, toPercent } from '../../../utils/sizeUtils'
import { mobileQuery } from '../../../utils/queryUtil'
import useIsMobile from '../../../hooks/useIsMobile'
import { ReactComponent as PlaySvg } from '../../../assets/mobile/play.svg'
import PreloadMedia from './preloadMedia'
import type { DesktopContextProps } from '../../desktop/pageWrappers/pageTypes'
import type { MobileContextProps } from '../../mobile/pageWrappers/pageTypes'
import type { MediaRef, ZoomMediaProps } from './mediaTypes'
import type { TypedPreloadStack } from '../../../utils/helpers/preloader/preloadManager'

interface StyledZoomMediaProps {
  $width: string | number | undefined
}
const ZoomMedia = forwardRef((props: ZoomMediaProps, ref: MediaRef) => {
  const { handleZoomMedia, zoomMedia, defaultCanAutoPlay, preloadManager } =
    useOutletContext<DesktopContextProps | MobileContextProps>()
  let { src } = props
  const { maxSize, width, isToolTip, ...rest } = props

  const isMobile = useIsMobile()
  const { pageId } = useContext(WorkPageContext)
  const mediaRef = useForwardedRef(ref)

  const mobileNoAutoPlay = isMobile && !defaultCanAutoPlay
  // for when the video is played manually
  const [forceAutoPlay, setForceAutoPlay] = useState(!mobileNoAutoPlay)

  useEffect(() => {
    if (!forceAutoPlay) setForceAutoPlay(!mobileNoAutoPlay)
  }, [isMobile, defaultCanAutoPlay])

  const device = getDevice(isMobile)

  src = isToolTip ? joinPaths(MediaType.ToolTips, src) : src
  const fallbackPath = joinPaths('/assets', device, 'work', pageId, MediaSize.Max, src)

  const mediaStack = !preloadManager?.enabled ? undefined :
    preloadManager?.findWorkMedia(pageId, src)

  const handleClick = () => {
    if (
      !forceAutoPlay &&
      defaultCanAutoPlay !== undefined &&
      rest.type === MediaFileType.Video
    ) return setForceAutoPlay(true)

    if (
      mediaStack &&
      getStackBreakpt(mediaStack.stack) === getFallbackKey()
    ) return

    handleZoomMedia({
      ...props,
      mediaStack,
      fallbackPath,
      getCurrentTime: () => (
        (
          'current' in mediaRef &&
          mediaRef.current &&
          'currentTime' in mediaRef.current
        ) ? mediaRef.current?.currentTime : undefined
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
            preloadManager?.imgPreloaded !== false) &&
            (!isMobile || !zoomMedia)
        })}
        stackData={mediaStack satisfies TypedPreloadStack | undefined}
        fallbackPath={fallbackPath}
        ref={mediaRef}
        onClick={handleClick} />
      {
        !forceAutoPlay &&
        defaultCanAutoPlay !== undefined &&
        rest.type === MediaFileType.Video &&
        <div>
          <PlaySvg />
        </div>
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
    width: ${({ $width }: StyledZoomMediaProps) => $width ?? percent(100)};
    position: absolute;
    pointer-events: none;
    ${mixins.flex('center', 'center')}

    svg {
      color: rgba(0,0,0,0.65);
      width: 13.5%;
    }
  }
`



export default ZoomMedia