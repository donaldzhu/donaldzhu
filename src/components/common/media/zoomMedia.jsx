import { forwardRef, useContext, useRef } from 'react'
import { useOutletContext } from 'react-router-dom'
import { styled } from 'styled-components'
import PreloadMedia from './preloadMedia'
import { WorkPageContext } from '../../../contexts/context'
import { percent, toPercent } from '../../../utils/sizeUtils'
import { joinPaths } from '../../../utils/commonUtils.ts'
import { MEDIA_SIZES, MEDIA_TYPES } from '../../../utils/helpers/preloader/preloadUtils'
import mixins from '../../../styles/mixins'

const ZoomMedia = forwardRef(function ZoomMedia(props, ref) {
  const { preloadManager, handleZoomMedia } = useOutletContext()
  const { pageId } = useContext(WorkPageContext)
  let mediaRef = useRef()
  mediaRef = ref || mediaRef

  let { src, maxSize, width, isToolTip, ...rest } = props
  let { type } = rest

  if (isToolTip) type = MEDIA_TYPES.toolTips

  src = isToolTip ? joinPaths(MEDIA_TYPES.toolTips, src) : src
  const fallbackPath = joinPaths('/assets/work', pageId, MEDIA_SIZES.max, src)
  const mediaStack = preloadManager?.enabled &&
    preloadManager.workPages[pageId][type].find(stack => stack.fileName === src)
  const handleClick = () =>
    handleZoomMedia({
      ...props,
      mediaStack,
      fallbackPath,
      getCurrentTime: () => mediaRef.current.currentTime,
      maxSize: typeof maxSize === 'number' ? toPercent(maxSize) : maxSize
    })

  return (
    <MediaContainer $width={width}>
      <PreloadMedia
        {...rest}
        mediaStack={mediaStack}
        fallbackPath={fallbackPath}
        ref={mediaRef}
        onClick={handleClick} />
    </MediaContainer>
  )
})

const MediaContainer = styled.div`
  ${mixins.flex('initial', 'center')}

  img, video {
    cursor: zoom-in;
    width: ${({ $width }) => $width || percent(100)};
    object-fit: cover;
  }
`

export default ZoomMedia