import { useState } from 'react'
import styled from 'styled-components'
import { useOutletContext } from 'react-router-dom'
import Anchor from '../../common/anchor'
import { MediaFileType } from '../../../utils/helpers/preloader/preloadUtils'
import mixins from '../../../styles/mixins'
import { domSizes } from '../../../styles/sizes'
import { fontLineHeights, fontSizes } from '../../../styles/fonts'
import PreloadMedia from '../../common/media/preloadMedia'
import { noStackDataError } from '../../../utils/typeUtils'
import type { WorkDataInterface } from '../../desktop/work/workTypes'
import type { MobileContextProps } from '../pageWrappers/pageTypes'

interface WorkThumbnailProps {
  data: WorkDataInterface
}

const WorkThumbnail = ({ data }: WorkThumbnailProps) => {
  const { title, abbr, tags, animatedThumbnail, id } = data
  const { preloadManager, canAutoPlay } = useOutletContext<MobileContextProps>()
  const [shouldAutoPlay] = useState(!!canAutoPlay)

  const stackData = preloadManager.findThumbnail(id)
  if (!stackData) throw noStackDataError('Thumbnail')
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
              preloadManager.imgPreloaded !== false
          })}
        stackData={stackData}
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