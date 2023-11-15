import styled from 'styled-components'
import { WorkDataInterface } from '../work/workTypes'
import Anchor from '../common/anchor'
import Media from '../common/media/media'
import { FileExt, MediaFileType } from '../../utils/helpers/preloader/preloadUtils'
import { joinPaths } from '../../utils/commonUtils'

interface WorkThumbnailMobileProps {
  data: WorkDataInterface
}

const WorkThumbnailMobile = ({ data }: WorkThumbnailMobileProps) => {
  const { title, tags, animatedThumbnail, id } = data
  const fallbackPath = joinPaths('assets/thumbnails/_mobile_test_', id) + '.' +
    (animatedThumbnail ? FileExt.Mp4 : FileExt.Webp)
  return (
    <ThumbnailLink to={id}>
      <Media
        type={animatedThumbnail ? MediaFileType.Video : MediaFileType.Image}
        src={fallbackPath} />
      <div>
        <Title>{title}</Title>
        <Tags>{tags.join(' + ')}</Tags>
      </div>
    </ThumbnailLink>
  )
}

const ThumbnailLink = styled(Anchor)`
  display: block;
  h3, p {
    display: block;
    padding-top: 0.35rem;
  }
`

const Title = styled.h3`
  font-size: 1.3rem;
`

const Tags = styled.p`
  font-size: 0.9rem;
`

export default WorkThumbnailMobile