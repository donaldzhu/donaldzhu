import styled from 'styled-components'
import Anchor from '../../common/anchor'
import Media from '../../common/media/media'
import { FileExt, MediaFileType } from '../../../utils/helpers/preloader/preloadUtils'
import { joinPaths } from '../../../utils/commonUtils'
import mixins from '../../../styles/mixins'
import { domSizes } from '../../../styles/sizes'
import { fontLineHeights, fontSizes } from '../../../styles/fonts'
import type { WorkDataInterface } from '../../desktop/work/workTypes'

interface WorkThumbnailProps {
  data: WorkDataInterface
}

const WorkThumbnail = ({ data }: WorkThumbnailProps) => {
  const { title, abbr, tags, animatedThumbnail, id } = data
  const fallbackPath = joinPaths('assets/thumbnails/_mobile_test_', id) + '.' +
    (animatedThumbnail ? FileExt.Mp4 : FileExt.Webp)
  return (
    <ThumbnailLink to={id}>
      <InfoContainer>
        <Title>{abbr ?? title}</Title>
        <Tags>{tags.join(' + ')}</Tags>
      </InfoContainer>
      <Media
        type={animatedThumbnail ? MediaFileType.Video : MediaFileType.Image}
        src={fallbackPath} />

    </ThumbnailLink>
  )
}

const ThumbnailLink = styled(Anchor)`
  ${mixins.flex('initial', 'space-between')}
  width: 100%;
  margin-bottom: ${domSizes.mobile.workIndex.thumbnail.margin.css};

  img, video {
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