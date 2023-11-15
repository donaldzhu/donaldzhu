import { MutableRefObject } from 'react'
import styled from 'styled-components'
import mixins from '../../styles/mixins'
import { domSizes } from '../../styles/sizes'
import TextContainer from '../common/styled/textContainer'
import WorkSideBarItem from './workSidebarItem'
import { WorkDataInterface } from './workTypes'

interface WorkIndexSidebarProps {
  workData: WorkDataInterface[]
  highlighted: string | undefined
  sidebarRef: MutableRefObject<HTMLAnchorElement | null>
  handleHover: (projectTitle: string) => void
}

const WorkIndexSidebar = ({
  workData,
  highlighted,
  sidebarRef,
  handleHover
}: WorkIndexSidebarProps) => {
  return (
    <>
      <SideBarContainer as='ul'>
        {workData.map(project => project.enabled && project.listed &&
          <WorkSideBarItem
            key={project.title}
            data={project}
            isHighlighted={highlighted === project.title}
            highlightedRef={sidebarRef}
            handleHover={handleHover} />)}
      </SideBarContainer>
    </>
  )
}

const SideBarContainer = styled(TextContainer)`
  ${mixins.innerMargin(domSizes.desktop.workIndex.innerMargin.css)}
  position: relative;
`

export default WorkIndexSidebar