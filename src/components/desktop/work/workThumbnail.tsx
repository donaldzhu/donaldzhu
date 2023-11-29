import { useOutletContext } from 'react-router-dom'
import styled from 'styled-components'
import { joinPaths } from '../../../utils/commonUtils'
import { FileExt, MediaFileType } from '../../../utils/helpers/preloader/preloadUtils'
import { getBreakptKey } from '../../../utils/queryUtil'
import Anchor from '../../common/anchor'
import PreloadMedia from '../../common/media/preloadMedia'
import { PreloadCategory } from '../../../utils/helpers/preloader/preloadManager'
import type { WorkAnchorProps } from './workTypes'
import type { DesktopContextProps } from '../pageWrappers/pageTypes'

const WorkThumbnail = ({ data, isHighlighted, highlightedRef, handleHover }: WorkAnchorProps) => {
  const { title, id, animatedThumbnail } = data
  const { preloadManager } = useOutletContext<DesktopContextProps>()

  const fallbackPath = joinPaths('/assets/thumbnails/', getBreakptKey(), id) + '.' +
    (animatedThumbnail ? FileExt.Webm : FileExt.Webp)

  return (
    <ThumbnailLink
      to={id}
      ref={isHighlighted ? highlightedRef : null}
      onMouseOver={() => handleHover(title)}>
      <PreloadMedia
        stackData={
          !preloadManager?.enabled ? undefined :
            preloadManager.preloadManager.stackData.find(stackData =>
              (stackData.stack.fileName.match(/^.*(?=\.)/) ?? [])[0] === id &&
              stackData.category === PreloadCategory.Thumbnail
            )
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