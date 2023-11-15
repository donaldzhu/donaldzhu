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
      {/* <div>
        <Img src='assets/thumbnails/_mobile_test_/dm2020.webp' />
        <h3>I VOTED!</h3>
        <p>Digital Asset</p>
      </div>
      <div>
        <Img src='assets/thumbnails/_mobile_test_/dm2020.webp' />
        <h3>I VOTED!</h3>
        <p>Digital Asset</p>
      </div>
      <div>
        <Img src='assets/thumbnails/_mobile_test_/dm2020.webp' />
        <h3>I VOTED!</h3>
        <p>Digital Asset</p>
      </div> */}
    </Container>
  )
}

const Container = styled.div`
  ${mixins.mobileBody()}
  position: absolute;
  top: ${domSizes.mobile.workIndex.top.css};

  img, video {
    width: 100%;
  }
`

const Title = styled.h3`

`

export default WorkIndexMobile