import { useCallback } from 'react'
import styled from 'styled-components'
import { fontLineHeights, fontParams, fontSizes } from '../../../styles/fonts'
import { domSizes } from '../../../styles/sizes'
import workDescriptions from '../../../data/work/workDescriptions.json'
import mixins from '../../../styles/mixins'
import { capitalize } from '../../../utils/commonUtils'
import TextContainer from '../../common/styled/textContainer'
import { parseHtml } from '../../../utils/reactUtils'
import { WorkPageContext } from '../../../contexts/context'
import usePreloadQueue from '../../../hooks/usePreloadQueue'
import type { WorkDataInterface } from '../../desktop/work/workTypes'
import type { WorkPageContentProps } from './workPageTypes'

interface WorkPageProps {
  data: WorkDataInterface
  Content: (props: WorkPageContentProps) => JSX.Element
}
const typedWorkDescriptions: Record<string, string> = workDescriptions
const WorkPage = ({ data, Content }: WorkPageProps) => {
  const { title, date, tags, medium } = data
  const pageId = data.id

  usePreloadQueue(true, preloadManager =>
    preloadManager.pagePreload(pageId), [data])

  const WorkInfo = useCallback(() => {
    return (
      <DescriptionContainer>
        <h1>{title}</h1>
        <Details>
          <p>
            <span>{date}</span>
            <ItemDelimiter>—</ItemDelimiter>
            <Tags>{capitalize(tags.join('/').toLocaleLowerCase())}</Tags>
          </p>
          <p>{capitalize(medium.join(', ').toLocaleLowerCase())}</p>
        </Details>
      </DescriptionContainer>
    )
  }, [data])

  const Description = useCallback(() => <TextContainer>
    {parseHtml(typedWorkDescriptions[pageId])}
  </TextContainer>, [data])

  return (
    <WorkPageContext.Provider value={{ pageId }}>
      <ContentContainer>
        <Content WorkInfo={WorkInfo} Description={Description} />
      </ContentContainer>
    </WorkPageContext.Provider>
  )
}

const DescriptionContainer = styled.div`
  ${mixins.mobileBody()}

  h1 {
    margin-top: ${domSizes.mobile.workPage.title.margin.css};
    font-size: ${fontSizes.mobile.workPage.title.css};
  }
`

const Details = styled.div`
  font-size: ${fontSizes.mobile.workPage.details.css};
  line-height: ${fontLineHeights.text};
  margin: ${domSizes.mobile.workPage.details.margin.css} 0;
  font-weight: ${fontParams.demiBold};

  span {
    ${mixins.fontVar({ MONO: 1 })};
  }
`

const ItemDelimiter = styled.span`
  margin: 0 0.35em;
`

const Tags = styled.i`
  ${mixins.slant()}
`

const ContentContainer = styled.div`
  ${mixins.flex()}
  position: absolute;
  top: ${domSizes.mobile.app.top.css};
  flex-direction: column;
  &>:last-child {
    margin-bottom: 3vw;
  }
`

export default WorkPage