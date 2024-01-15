import { useOutletContext } from 'react-router-dom'
import styled from 'styled-components'
import { joinPaths } from '../../../utils/commonUtils'
import { ImgExt, MediaFileType, VidExt } from '../../../utils/helpers/preloader/preloadUtils'
import { getBreakptKey } from '../../../utils/queryUtil'
import Anchor from '../../common/anchor'
import PreloadMedia from '../../common/media/preloadMedia'
import { Device } from '../../../utils/breakptTypes'
import type { WorkAnchorProps } from './workTypes'
import type { DesktopContextProps } from '../pageWrappers/pageTypes'

const WorkThumbnail = ({ data, isHighlighted, highlightedRef, handleHover }: WorkAnchorProps) => {
  const { title, id, animatedThumbnail } = data
  const { preloadManager } = useOutletContext<DesktopContextProps>()

  const fallbackPath = '/' + joinPaths(preloadManager.assetPath, 'thumbnails', getBreakptKey(Device.Desktop), id) + '.' +
    (animatedThumbnail ? VidExt.Webm : ImgExt.Webp)

  return (
    <ThumbnailLink
      to={id}
      ref={isHighlighted ? highlightedRef : null}
      onMouseOver={() => handleHover(title)}>
      <PreloadMedia
        {...(!animatedThumbnail ? {} :
          { canAutoPlay: preloadManager?.imgPreloaded !== false })}
        stackData={!preloadManager?.enabled ? undefined :
          preloadManager.findThumbnail(id)}
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