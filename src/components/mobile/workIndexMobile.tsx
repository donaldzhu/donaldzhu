import styled from 'styled-components'
import { domSizes } from '../../styles/sizes'
import mixins from '../../styles/mixins'
import { getParsedWorkData } from '../../utils/commonUtils'
import { Device } from '../../utils/queryUtil'
import WorkThumbnailMobile from './workThumbnailMobile'


const WorkIndexMobile = () => {
  return (
    <Container>
      {getParsedWorkData(Device.mobile)
        .map(project => project.listed && <WorkThumbnailMobile
          key={project.title}
          data={project} />)}
    </Container>
  )
}

const Container = styled.div`
  ${mixins.mobileBody()}
  position: absolute;
  top: ${domSizes.mobile.app.top.css};
`


export default WorkIndexMobile