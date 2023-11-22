import { useOutletContext } from 'react-router-dom'
import styled from 'styled-components'
import { joinPaths } from '../../../utils/commonUtils'
import { FileExt, MediaFileType } from '../../../utils/helpers/preloader/preloadUtils'
import { getPreloadBreakpt } from '../../../utils/queryUtil'
import Anchor from '../../common/anchor'
import PreloadMedia from '../../common/media/preloadMedia'
import type { WorkAnchorProps } from './workTypes'
import type { DesktopContextProps } from '../pageWrappers/pageTypes'

const WorkThumbnail = ({ data, isHighlighted, highlightedRef, handleHover }: WorkAnchorProps) => {
  const { title, id, animatedThumbnail } = data
  const { preloadManager } = useOutletContext<DesktopContextProps>()

  const fallbackPath = joinPaths('/assets/thumbnails/', getPreloadBreakpt(), id) + '.' +
    (animatedThumbnail ? FileExt.Webm : FileExt.Webp)
  return (
    <ThumbnailLink
      to={id}
      ref={isHighlighted ? highlightedRef : null}
      onMouseOver={() => handleHover(title)}>
      <PreloadMedia
        mediaStack={
          preloadManager?.enabled ?
            preloadManager.thumbnails.find(stack => stack.pageId === id) :
            undefined
        }
        fallbackPath={fallbackPath}
        type={animatedThumbnail ? MediaFileType.Video : MediaFileType.Image} />
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