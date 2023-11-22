import styled from 'styled-components'
import mixins from '../../../styles/mixins'
import { domSizes } from '../../../styles/sizes'
import TextContainer from '../../common/styled/textContainer'
import { getParsedWorkData } from '../../../utils/commonUtils'
import { Device } from '../../../utils/queryUtil'
import WorkSideBarItem from './workSidebarItem'
import type { MutableRefObject } from 'react'

interface WorkIndexSidebarProps {
  highlighted: string | undefined
  sidebarRef: MutableRefObject<HTMLAnchorElement | null>
  handleHover: (projectTitle: string) => void
}

const WorkIndexSidebar = ({
  highlighted,
  sidebarRef,
  handleHover
}: WorkIndexSidebarProps) => {
  return (
    <>
      <SideBarContainer as='ul'>
        {getParsedWorkData(Device.desktop)
          .map(project => project.listed &&
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