import Anchor from '../../common/anchor'
import WorkImg from '../../common/media/workImg'
import WorkVid from '../../common/media/workVid'
import RowContainer from '../../common/rowContainer'
import SmallText from '../../common/styled/smallText'
import TextContainer from '../../common/styled/textContainer'
import type { WorkPageContentProps } from '../work/workPageTypes'

const PageVectorSpinStroke = ({ WorkInfo }: WorkPageContentProps) => {
  return (
    <>
      <RowContainer>
        <WorkImg src='1.webp' />
      </RowContainer>
      <WorkInfo />
      <TextContainer>
        <SmallText>[Term 1 <Anchor to='/assets-local/pdf/vector-spin-stroke-literature-review.pdf' target="_blank">literature review</Anchor>]</SmallText>
        <SmallText>
          <i>VECTOR, SPIN, STROKE.</i> is an ongoing series that explores the
          role of tools and tool-making within design investigations. To position design
          as an investigative activity is to favor a bottom-up approach instead of a top-down
          one. The former discovers, unearths, and assesses, while the latter predetermines,
          prescribes, and dictates. Thus, a tool is something that stands between oneself
          and their outputs—it sets up the conditions within one's processes. As such,
          tool-making is an activity through which I choose to structure my investigations
          within graphic design.
        </SmallText>
      </TextContainer>
      <RowContainer>
        <WorkImg src='2.webp' />
      </RowContainer>
      <TextContainer>
        <SmallText>
          For this study, the toolset has been chosen to intersect with the field of
          typography. Namely, using tools to construct and deconstruct type and look
          at the conditions with which visual communication wrestles.
        </SmallText>
      </TextContainer>
      <RowContainer>
        <WorkVid src='1.mp4' />
      </RowContainer>
      <RowContainer>
        <WorkImg src='3.webp' />
      </RowContainer>
      <TextContainer>
        <SmallText>
          It is examined
          through three categories: <i><Anchor to='../vector-struct'>VECTOR</Anchor></i> is
          interested in the physical manipulation of parametric type; <i><Anchor to='../spin'>SPIN</Anchor></i> studies
          the interaction between typography, topology, and motion; and <i><Anchor to='../stroke'>STROKE</Anchor></i> explores
          the relationship between the writing hand, styluses, and letterforms.
        </SmallText>
      </TextContainer>
      <RowContainer>
        <WorkImg src='4.webp' />
      </RowContainer>
      <RowContainer>
        <WorkImg src='5.webp' />
      </RowContainer>
      <RowContainer>
        <WorkImg src='6.webp' />
      </RowContainer>
      <TextContainer>
        <SmallText>
          Being constructed physically, the material nature of the tools gives them
          different performances and affordances. As such, to build tools from the
          ground up is to allow them to be potential openings to material reality,
          through which new modes of thinking and making could emerge.
        </SmallText>
      </TextContainer>
      <RowContainer>
        <WorkImg src='7.webp' />
      </RowContainer>
      <RowContainer cols={[2, 3]}>
        <WorkImg src='8.webp' />
        <WorkImg src='9.webp' />
      </RowContainer>
      <RowContainer >
        <WorkImg src='10.webp' />
      </RowContainer>
    </>
  )
}

export default PageVectorSpinStroke