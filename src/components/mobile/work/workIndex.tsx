import styled from 'styled-components'
import { domSizes } from '../../../styles/sizes'
import mixins from '../../../styles/mixins'
import { getParsedWorkData } from '../../../utils/commonUtils'
import { Device } from '../../../utils/breakptTypes'
import usePreloadQueue from '../../../hooks/usePreloadQueue'
import WorkThumbnail from './workThumbnail'

const WorkIndex = () => {
  usePreloadQueue(true, preloadManager =>
    preloadManager.defaultPreload())
  return (
    <Container>
      {getParsedWorkData(Device.Mobile)
        .map(project => project.listed && <WorkThumbnail
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


export default WorkIndex