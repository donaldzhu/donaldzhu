import Text from '../common/styled/text'
import TextContainer from '../common/styled/textContainer'
import useSidebar from '../../hooks/useSidebar'

const Home = () => useSidebar(<HomeSidebar />)

const HomeSidebar = () =>
  <TextContainer>
    <Text>
      <b>DONALD ZHU is a graphic designer based in Toronto, Canada.</b>
    </Text>
    <Text>
      He finished his degree at OCAD University in 2023. His work primarily focuses on <i>typography, interaction, and code</i>. In his free time, he likes to work on custom typefaces and side web projects.
    </Text>
  </TextContainer>

export default Home