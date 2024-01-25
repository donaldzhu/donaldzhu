import { useRef } from 'react'
import styled from 'styled-components'
import { WorkPageContext } from '../../../contexts/context'
import workDescriptions from '../../../data/work/workDescriptions.json'
import useCanvas from '../../../hooks/useCanvas'
import usePreloadQueue from '../../../hooks/usePreloadQueue'
import useSidebar from '../../../hooks/useSidebar'
import drawToolTip from '../../../p5/sketches/desktop/drawToolTip'
import { fontLineHeights, fontParams, fontSizes } from '../../../styles/fonts'
import mixins from '../../../styles/mixins'
import { domSizes } from '../../../styles/sizes'
import { capitalize } from '../../../utils/commonUtils'
import { parseHtml } from '../../../utils/reactUtils'
import MainContainer from '../../common/styled/mainContainer'
import TextContainer from '../../common/styled/textContainer'
import type { WorkDataInterface } from './workTypes'

interface WorkPageProps {
  data: WorkDataInterface
  Content: () => JSX.Element
}

const typedWorkDescriptions: Record<string, string> = workDescriptions
const WorkPage = ({ data, Content }: WorkPageProps) => {
  const pageId = data.id

  const toolTipRef = useRef<HTMLDivElement>(null)
  const popUpRef = useRef<HTMLDivElement>(null)
  const setupDone = useCanvas(() =>
    drawToolTip({ toolTipRef, popUpRef }))
  usePreloadQueue(setupDone, preloadManager => {
    console.log(performance.now() / 1000)
    preloadManager.pagePreload(pageId)
  }, [data])
  useSidebar(<WorkPageSidebar {...data} />)


  return (
    <WorkPageContext.Provider value={{ toolTipRef, popUpRef, pageId }}>
      <MainContainer>
        <ContentContainer>
          <Content />
        </ContentContainer>
      </MainContainer>
    </WorkPageContext.Provider>
  )
}

const WorkPageSidebar = ({ title, id, date, tags, medium }: WorkDataInterface) =>
  <div>
    <Title>{title}</Title>
    <Details>
      <p>{date}</p>
      <p>{capitalize(tags.join('/').toLocaleLowerCase())}</p>
      <p>{capitalize(medium.join(', ').toLocaleLowerCase())}</p>
    </Details>
    <TextContainer>{parseHtml(typedWorkDescriptions[id])}</TextContainer>
  </div>

const ContentContainer = styled.div`
  ${mixins.innerMargin(domSizes.desktop.workPage.media.gap.css)}
`

const Title = styled.h1`
  margin-bottom: 1em;
`

const Details = styled.div`
  font-size: ${fontSizes.desktop.workPage.details.css};
  line-height: ${fontLineHeights.text};
  margin-bottom: ${domSizes.desktop.text.innerMargin.css};
  font-weight: ${fontParams.demiBold};

  :first-child{
    ${mixins.fontVar({ MONO: 1 })};
  }
`

export default WorkPage