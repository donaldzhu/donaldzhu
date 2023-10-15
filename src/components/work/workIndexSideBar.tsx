import { styled } from 'styled-components'
import WorkSideBarItem from './workSidebarItem'
import TextContainer from '../common/styled/textContainer'
import Anchor from '../common/anchor'
import usePortfolioQuery from '../../hooks/usePortfolioQuery'
import { domSizes } from '../../styles/sizes'
import mixins from '../../styles/mixins'
import { fontFamilies, fontSizes } from '../../styles/fonts'
import { appendQuery, validateString } from '../../utils/commonUtils'
import { WorkDataInterface } from './workIndex'
import { MutableRefObject } from 'react'

interface WorkIndexSidebarProps {
  workData: WorkDataInterface[]
  highlighted: string | undefined
  sidebarRef: MutableRefObject<HTMLAnchorElement | null>
  handleHover: (projectTitle: string) => void
}

const WorkIndexSidebar = ({ workData, highlighted, sidebarRef, handleHover }: WorkIndexSidebarProps) => {
  const storageKey = 'pid'
  const pid = usePortfolioQuery().pid
  const cachedPid = sessionStorage.getItem(storageKey)
  const portfolioNavText = pid ? 'See all work (to main site) +' : 'Return to portfolio -'

  return (
    <SideBarContainer as='ul'>
      {workData.map(project => project.enabled && project.listed &&
        <WorkSideBarItem
          key={project.title}
          data={project}
          isHighlighted={highlighted === project.title}
          highlightedRef={sidebarRef}
          handleHover={handleHover} />)}
      {(pid || cachedPid) && <ToMainSiteLink
        to={'/work' + (validateString(!pid, appendQuery(['pid', cachedPid])))}
        noQuery>
        {portfolioNavText}
      </ToMainSiteLink>}
    </SideBarContainer>
  )
}

const SideBarContainer = styled(TextContainer)`
  ${mixins.innerMargin(domSizes.workIndex.innerMargin.css)}
  position: relative;
`

const linkPositionOffset = domSizes.footer.link.padding.mult(-1).css
const ToMainSiteLink = styled(Anchor)`
  padding: ${domSizes.footer.link.padding.css};
  font-family: ${fontFamilies.sansFont}; 
  font-size: ${fontSizes.footer.link.css};
  position: absolute;
  left: ${linkPositionOffset};
  bottom: ${linkPositionOffset};
`


export default WorkIndexSidebar