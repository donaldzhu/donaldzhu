import { forwardRef, useContext } from 'react'
import { useOutletContext } from 'react-router-dom'
import styled from 'styled-components'
import { WorkPageContext } from '../../../contexts/context'
import mixins from '../../../styles/mixins'
import { joinPaths } from '../../../utils/commonUtils'
import useForwardedRef from '../../../hooks/useForwaredRef'
import { MediaFileType, MediaSize, MediaType } from '../../../utils/helpers/preloader/preloadUtils'
import { percent, toPercent } from '../../../utils/sizeUtils'
import { maxQueries } from '../../../utils/queryUtil'
import useIsMobile from '../../../hooks/useIsMobile'
import PreloadMedia from './preloadMedia'
import type { ImgStack, VidStack } from '../../../utils/helpers/preloader/mediaStack'
import type { DesktopContextProps } from '../../desktop/pageWrappers/pageTypes'
import type { MobileContextProps } from '../../mobile/pageWrappers/pageTypes'
import type { MediaRef, ZoomMediaProps } from './mediaTypes'


interface StyledZoomMediaProps {
  $width: string | number | undefined
}
const ZoomMedia = forwardRef((props: ZoomMediaProps, ref: MediaRef) => {
  const outletContext =
    useOutletContext<DesktopContextProps | MobileContextProps>()
  const isMobile = useIsMobile()

  // TODO
  const handleZoomMedia = 'handleZoomMedia' in outletContext ?
    outletContext.handleZoomMedia : (_: any) => { }
  const preloadManager = 'preloadManager' in outletContext ?
    outletContext.preloadManager : undefined

  const { pageId, previewLoaded } = useContext(WorkPageContext)
  const mediaRef = useForwardedRef(ref)

  let { src } = props
  const { maxSize, width, isToolTip, ...rest } = props
  const { type } = rest

  const mediaType = isToolTip ?
    MediaType.ToolTips : type === MediaFileType.Image ?
      MediaType.Images : MediaType.Videos

  src = isToolTip ? joinPaths(MediaType.ToolTips, src) : src
  const fallbackPath = !isMobile ?
    joinPaths('/assets/desktop/work', pageId, MediaSize.Max, src) :
    joinPaths('/assets/mobile/work', pageId, MediaSize.Max, src)
  const mediaStack = preloadManager?.enabled ?
    preloadManager?.workPages[pageId][mediaType]?.find(stack => stack.fileName === src) :
    undefined

  // TODO
  const handleClick = handleZoomMedia ? () =>
    handleZoomMedia({
      ...props,
      mediaStack,
      fallbackPath,
      getCurrentTime: () => (('current' in mediaRef && mediaRef.current && 'currentTime' in mediaRef.current) ?
        mediaRef.current?.currentTime : undefined) ?? 0,
      maxSize: typeof maxSize === 'number' ? toPercent(maxSize) : maxSize
    }) : () => { }

  return (
    <MediaContainer $width={width}>
      <PreloadMedia
        {...rest}
        {...(rest.type === MediaFileType.Video ? { canAutoPlay: previewLoaded !== false } : {})}
        mediaStack={mediaStack satisfies ImgStack | VidStack | undefined}
        fallbackPath={fallbackPath}
        ref={mediaRef}
        onClick={handleClick} />
    </MediaContainer>
  )
})

const MediaContainer = styled.div<StyledZoomMediaProps>`
  ${mixins.flex('initial', 'center')}

  img, video {
    cursor: zoom-in;
    object-fit: cover;
    width: ${({ $width }: StyledZoomMediaProps) => $width ?? percent(100)};

    @media ${maxQueries.l} {
      padding-bottom: 2vw;

    }
  }
`

export default ZoomMedia