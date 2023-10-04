import { styled } from 'styled-components'
import WorkSideBarItem from './workSidebarItem'
import TextContainer from '../common/styled/textContainer'
import sizes from '../../styles/sizes'
import mixins from '../../styles/mixins'
import workData from '../../data/work/workData'

const WorkSideBar = ({ highlighted, sidebarRef, handleHover }) =>
  <SideBarContainer width={sizes.sidebarWidth} as='ul'>
    {workData.map(project => project.enabled && project.listed &&
      <WorkSideBarItem
        key={project.title}
        data={project}
        isHighlighted={highlighted === project.title}
        highlightedRef={sidebarRef}
        handleHover={handleHover} />)}
  </SideBarContainer>

const SideBarContainer = styled(TextContainer)`
  ${mixins.innerMargin(sizes.workIndexInnerMargin)}
`


export default WorkSideBar