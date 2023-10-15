import useSidebar from '../../hooks/useSidebar'
import Anchor from '../common/anchor'
import SmallText from '../common/styled/smallText'
import Text from '../common/styled/text'
import TextContainer from '../common/styled/textContainer'

const ProcessSidebar = () => {
  return (
    <TextContainer>
      <Text>
        <b>My design process prioritizes an interdisciplinary, bottom-up approach.</b>
      </Text>
      <SmallText>Contrary to the common perception of the “creative” designer, meaningful works are often not the result of spontaneous, top-down executions. Instead, my work is the cumulated outputs of vigorous, investigative makings that seek to deconstruct and reconstruct communication in the provided context. For that reason, my practice is centered around <i>design systems</i> and <i>tool-making.</i></SmallText>
      <SmallText>A system, in short, is a set of things that form the mechanisms and networks within each design investigation. They can be visual (scale, contrast, movement) or conceptual (hierarchy, juxtaposition, tone). <i>Verbalizing these parameters allows them to be discussed, reflected upon, intentionally decided on, and exhaustively iterated.</i> By doing so, its inherent structures can be broken and appropriated, through which the inputs could be transformed endlessly in unforeseen ways through the making process. As such, the systematic outputs are the self-informed products that emerged from within the given concern of communication.</SmallText>
      <SmallText>Simultaneously, tools and tool-making play an inextricable role in my design process <Anchor to='work/vector-spin-stroke'>(my capstone project on tools)</Anchor>. Given each tool’s particular performances and mechanisms, they stand between the designer and their outputs, setting the conditions within each investigation. In my case, to approach a situation from the ground up often involves making my own tools. Whether it be digital (coded, generative, algorithmic) or <Anchor to='work/stroke'>analog</Anchor> (tactile, haptic, tangible), they offer their own ways of assessing a given problem. In other words, tools are <i>potential openings to design challenges—through which new modes of thinking and making could emerge.</i></SmallText>
    </TextContainer>
  )
}

const Process = () => {
  useSidebar(<ProcessSidebar />)
  return undefined
}

export default Process