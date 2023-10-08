import { useOutletContext } from 'react-router-dom'
import { styled } from 'styled-components'
import PreloadMedia from '../common/media/preloadMedia'
import { joinPaths } from '../../utils/commonUtils'
import { FILE_EXT, MEDIA_TYPES } from '../../utils/helpers/preloader/preloadUtils'
import Anchor from '../common/anchor'
import { getBreakpointKey } from '../../utils/queryUtil'

const WorkThumbnail = ({ data, isHighlighted, highlightedRef, handleHover }) => {
  const { title, alt, id, animatedThumbnail } = data
  const { preloadManager } = useOutletContext()

  const fallbackPath = joinPaths('/assets/thumbnails/', getBreakpointKey(), id) + '.' +
    (animatedThumbnail ? FILE_EXT.webm : FILE_EXT.webp)
  return (
    <ThumbnailLink
      to={id}
      ref={isHighlighted ? highlightedRef : null}
      onMouseOver={() => handleHover(title)}>
      <PreloadMedia
        mediaStack={preloadManager?.enabled && preloadManager.thumbnails.find(stack => stack.pageId === id)}
        fallbackPath={fallbackPath}
        alt={alt}
        type={animatedThumbnail ? MEDIA_TYPES.videos : MEDIA_TYPES.images} />
    </ThumbnailLink>
  )
}

const ThumbnailLink = styled(Anchor)`  
  display: block;
   img, video {
    width: 100%;  
  }
`


export default WorkThumbnail