import { WorkPageMobileContentProps } from '../workPageTypes'
import RowContainer from '../../common/rowContainer'
import WorkImg from '../../common/media/workImg'
import TextContainer from '../../common/styled/textContainer'
import SmallText from '../../common/styled/smallText'

const PageSystemizedCreativityMobile = ({ WorkInfo }: WorkPageMobileContentProps) => {
  return (
    <>
      <RowContainer>
        <WorkImg src='1.webp' />
      </RowContainer>
      <WorkInfo />
      <TextContainer>
        <SmallText>
          This book documents my first year of formal graphic design education.
          Contrary to preconceived notions of “creativity”—a spontaneous,
          result-driven approach—systems and processes play a much more integral
          role in design. Through the help of design languages and reflections,
          design decisions can be made conscious and autonomous.
        </SmallText>
      </TextContainer>
      <RowContainer>
        <WorkImg src='4.webp' />
      </RowContainer>
      <RowContainer>
        <WorkImg src='5.webp' />
      </RowContainer>
      <TextContainer>
        <SmallText>
          By structuring a systematic approach, the conditions and parameters
          of any given inquiry become visible and iterable, allowing the
          investigation to be exhaustive. This book employs one such self-described
          system to illustrate the concept.
        </SmallText>
      </TextContainer>
      <RowContainer>
        <WorkImg src='6.webp' />
      </RowContainer>
      <RowContainer>
        <WorkImg src='7.webp' />
      </RowContainer>
      <RowContainer>
        <WorkImg src='8.webp' />
      </RowContainer>
    </>
  )
}

export default PageSystemizedCreativityMobile