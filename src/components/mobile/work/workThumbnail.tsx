import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useOutletContext } from 'react-router-dom'
import Anchor from '../../common/anchor'
import { ImgExt, MediaFileType, VidExt } from '../../../utils/helpers/preloader/preloadUtils'
import { joinPaths } from '../../../utils/commonUtils'
import mixins from '../../../styles/mixins'
import { domSizes } from '../../../styles/sizes'
import { fontLineHeights, fontSizes } from '../../../styles/fonts'
import PreloadMedia from '../../common/media/preloadMedia'
import { getBreakptKey } from '../../../utils/queryUtil'
import { Device } from '../../../utils/breakptTypes'
import type { WorkDataInterface } from '../../desktop/work/workTypes'
import type { MobileContextProps } from '../pageWrappers/pageTypes'

interface WorkThumbnailProps {
  data: WorkDataInterface
}

const WorkThumbnail = ({ data }: WorkThumbnailProps) => {
  const { title, abbr, tags, animatedThumbnail, id } = data
  const { preloadManager, canAutoPlay } = useOutletContext<MobileContextProps>()
  const [shouldAutoPlay] = useState(!!canAutoPlay)

  const fallbackPath = joinPaths('assets/mobile/thumbnails', getBreakptKey(Device.Mobile), id) + '.' +
    (animatedThumbnail ? VidExt.Mp4 : ImgExt.Webp)
  return (
    <ThumbnailLink to={id}>
      <InfoContainer>
        <Title>{abbr ?? title}</Title>
        <Tags>{tags.join(' + ')}</Tags>
      </InfoContainer>
      <PreloadMedia
        {...(!animatedThumbnail ? {} :
          {
            canAutoPlay:
              shouldAutoPlay &&
              preloadManager?.imgPreloaded !== false
          })}
        stackData={!preloadManager?.enabled ? undefined :
          preloadManager.findThumbnail(id)}
        fallbackPath={fallbackPath}
        type={animatedThumbnail ? MediaFileType.Video : MediaFileType.Image} />
    </ThumbnailLink>
  )
}

const ThumbnailLink = styled(Anchor)`
  ${mixins.flex('initial', 'space-between')}
  width: 100%;
  margin-bottom: ${domSizes.mobile.workIndex.thumbnail.margin.css};

  img, video {
    flex: none;
    width: ${domSizes.mobile.workIndex.thumbnail.width.css};
  }
`

const InfoContainer = styled.div`
  padding-right: ${domSizes.mobile.workIndex.gap.css};
`

const Title = styled.h3`
  display: block;
  font-size: ${fontSizes.mobile.workIndex.title.css};
  line-height: ${fontLineHeights.text};
`

const Tags = styled.p`
  ${mixins.textMono()}
  display: block;
  font-size: ${fontSizes.mobile.workIndex.tags.css};
  padding-top: ${domSizes.mobile.workIndex.tags.padding.top.css};
`

export default WorkThumbnail