import { useRef } from 'react'
import { styled } from 'styled-components'
import MainContainer from '../common/styled/mainContainer'
import useSidebar from '../../hooks/useSidebar'
import useCanvas from '../../hooks/useCanvas'
import usePreloadQueue from '../../hooks/usePreloadQueue'
import { WorkPageContext } from '../../contexts/context'
import drawToolTip from '../../p5/sketches/drawToolTip'
import { parseHtml } from '../../utils/reactUtils'
import { capitalize } from '../../utils/commonUtils'
import { fontSizes } from '../../styles/fonts'
import sizes from '../../styles/sizes'
import mixins from '../../styles/mixins'
import workDescriptions from '../../data/work/workDescriptions'
import TextContainer from '../common/styled/textContainer'

const WorkPage = ({ data, Content }) => {
  const toolTipRef = useRef()
  const popUpRef = useRef()
  const setupDone = useCanvas(() =>
    drawToolTip({ toolTipRef, popUpRef }))
  usePreloadQueue(setupDone, preloadManager =>
    preloadManager.pagePreload(data.id), [data])
  useSidebar(<WorkPageSidebar {...data} />)

  const pageId = data.id
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

const WorkPageSidebar = ({ title, id, date, tags, medium }) =>
  <div>
    <h1>{title}</h1>
    <Details>
      <p>{date}</p>
      <p>{capitalize(tags.join('/').toLocaleLowerCase())}</p>
      <p>{capitalize(medium.join(', ').toLocaleLowerCase())}</p>
    </Details>
    <TextContainer>{parseHtml(workDescriptions[id])}</TextContainer>
  </div>

const ContentContainer = styled.div`
  ${mixins.innerMargin(sizes.workPageGridGap)}
`


const Details = styled.div`
  font-size: ${fontSizes.workDetails};
  line-height: ${fontSizes.textLineHeight};
  margin-bottom: ${sizes.textInnerMargin};
  font-weight: 450;
  
  :first-child{
    ${mixins.fontVar({ MONO: 1 })};
  }
`

export default WorkPage