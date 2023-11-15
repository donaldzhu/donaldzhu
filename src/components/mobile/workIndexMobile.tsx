import styled from 'styled-components'
import Img from '../common/media/img'
import workData from '../../data/work/workData.json'
import { domSizes } from '../../styles/sizes'
import mixins from '../../styles/mixins'
import WorkThumbnailMobile from './workThumbnailMobile'


const WorkIndexMobile = () => {
  return (
    <Container>
      {workData.map(project => project.enabled && project.listed && <WorkThumbnailMobile
        key={project.title}
        data={project}
      />)}
    </Container>
  )
}

const Container = styled.div`
  ${mixins
    .chain()
    .mobileBody()
    .innerMargin(domSizes.mobile.workIndex.innerMargin.css)}
  position: absolute;
  top: ${domSizes.mobile.workIndex.top.css};

  img, video {
    width: 100%;
  }
`


export default WorkIndexMobile