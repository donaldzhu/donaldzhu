import { useCallback } from 'react'
import styled from 'styled-components'
import { WorkDataInterface } from '../work/workTypes'
import { fontLineHeights, fontParams } from '../../styles/fonts'
import { domSizes } from '../../styles/sizes'
import workDescriptions from '../../data/work/workDescriptions.json'
import mixins from '../../styles/mixins'
import { capitalize } from '../../utils/commonUtils'
import TextContainer from '../common/styled/textContainer'
import { parseHtml } from '../../utils/reactUtils'
import { WorkPageContext } from '../../contexts/context'
import SmallText from '../common/styled/smallText'
import { WorkPageMobileProps } from './workPageTypes'

// TODO
interface WorkPageProps {
  data: WorkDataInterface
  Content: (props: WorkPageMobileProps) => JSX.Element
}

const typedWorkDescriptions: Record<string, string> = workDescriptions
const WorkPageMobile = ({ data, Content }: WorkPageProps) => {
  const { title, date, tags, medium, id } = data

  const WorkInfo = useCallback(() => {
    return (
      <DescriptionContainer>
        <Title>{title}</Title>
        <Details>
          <SmallText>
            <span>{date}</span>
            <ItemDelimiter>—</ItemDelimiter>
            <Tags>{capitalize(tags.join('/').toLocaleLowerCase())}</Tags>
          </SmallText>
          <SmallText>{capitalize(medium.join(', ').toLocaleLowerCase())}</SmallText>
        </Details>
      </DescriptionContainer>
    )
  }, [data])

  const Description = useCallback(() => <TextContainer>
    {parseHtml(typedWorkDescriptions[id])}
  </TextContainer>, [data])

  return (
    <WorkPageContext.Provider value={{ pageId: id }}>
      <ContentContainer>
        <Content WorkInfo={WorkInfo} Description={Description} />
      </ContentContainer>
    </WorkPageContext.Provider>
  )
}

const DescriptionContainer = styled.div`
  ${mixins.mobileBody()}
`

const Title = styled.h1`
  margin-top: 0.75rem;
  font-size: 1.45rem !important; // TODO
`

const Details = styled.div`
  font-size: 0.8rem;
  line-height: ${fontLineHeights.text};
  margin: ${domSizes.desktop.text.innerMargin.css} 0;
  font-weight: ${fontParams.demiBold};

  :first-child{
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

export default WorkPageMobile