import { styled } from 'styled-components'
import WorkSideBarItem from './workSidebarItem'
import TextContainer from '../common/styled/textContainer'
import Anchor from '../common/anchor'
import usePortfolioQuery from '../../hooks/usePortfolioQuery'
import sizes from '../../styles/sizes'
import mixins from '../../styles/mixins'
import { fontFamilies, fontSizes } from '../../styles/fonts'
import { appendQuery } from '../../utils/commonUtils'

const WorkSideBar = ({ workData, highlighted, sidebarRef, handleHover }) => {
  const storageKey = 'pid'
  const pid = usePortfolioQuery().pid
  const cachedPid = sessionStorage.getItem(storageKey)
  const portfolioNavText = pid ? 'See all work (to main site) +' : 'Return to portfolio -'

  return (
    <SideBarContainer width={sizes.sidebarWidth} as='ul'>
      {workData.map(project => project.enabled && project.listed &&
        <WorkSideBarItem
          key={project.title}
          data={project}
          isHighlighted={highlighted === project.title}
          highlightedRef={sidebarRef}
          handleHover={handleHover} />)}
      {(pid || cachedPid) && <ToMainSiteLink
        to={'/work' + (!pid ? appendQuery(['pid', cachedPid]) : '')}
        noQuery>
        {portfolioNavText}
      </ToMainSiteLink>}
    </SideBarContainer>
  )
}

const SideBarContainer = styled(TextContainer)`
  ${mixins.innerMargin(sizes.workIndexInnerMargin)}
  position: relative;
`

const linkPositionOffset = `calc(${sizes.footerLinkPadding} * -1)`
const ToMainSiteLink = styled(Anchor)`
  padding: ${sizes.footerLinkPadding};
  font-family: ${fontFamilies.sansFont}; 
  font-size: ${fontSizes.footerLink};
  position: absolute;
  left: ${linkPositionOffset};
  bottom: ${linkPositionOffset};
`


export default WorkSideBar