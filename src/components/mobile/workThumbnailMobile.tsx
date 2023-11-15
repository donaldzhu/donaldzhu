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
  const { id, animatedThumbnail } = data
  const fallbackPath = joinPaths('assets/thumbnails/_mobile_test_', id) + '.' +
    (animatedThumbnail ? FileExt.Mp4 : FileExt.Webp)
  return (
    <ThumbnailLink to={id} onClick={e => e.preventDefault()}>
      <Media
        type={animatedThumbnail ? MediaFileType.Video : MediaFileType.Image}
        src={fallbackPath} />
    </ThumbnailLink>
  )
}

const ThumbnailLink = styled(Anchor)`

`

export default WorkThumbnailMobile