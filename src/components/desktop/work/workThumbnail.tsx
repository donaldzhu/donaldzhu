import { useOutletContext } from 'react-router-dom'
import styled from 'styled-components'
import { MediaFileType } from '../../../utils/helpers/preloader/preloadUtils'
import Anchor from '../../common/anchor'
import PreloadMedia from '../../common/media/preloadMedia'
import { noStackDataError } from '../../../utils/typeUtils'
import type { WorkAnchorProps } from './workTypes'
import type { DesktopContextProps } from '../pageWrappers/pageTypes'

const WorkThumbnail = ({ data, isHighlighted, highlightedRef, handleHover }: WorkAnchorProps) => {
  const { title, id, animatedThumbnail } = data
  const { preloadManager } = useOutletContext<DesktopContextProps>()

  const stackData = preloadManager.findThumbnail(id)
  if (!stackData) throw noStackDataError('Thumbnail')
  return (
    <ThumbnailLink
      to={id}
      ref={isHighlighted ? highlightedRef : null}
      onMouseOver={() => handleHover(title)}>
      <PreloadMedia
        {...(!animatedThumbnail ? {} :
          { canAutoPlay: preloadManager.imgPreloaded !== false })}
        stackData={stackData}
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