import styled from 'styled-components'
import mixins from '../../styles/mixins'
import colors from '../../styles/colors'
import PopUpContainer from './popUpContainer'
import { fontSizes } from '../../styles/fonts'
import { sizes } from '../../styles/sizes'

const AutoPlayPopUp = () => {
  return (
    <FullScreenContainer>
      <Container>
        <Message>Your browser has blocked autoplay; dismiss this dialog to activate the website</Message>
        <Instruction>(Click anywhere to dismiss)</Instruction>
      </Container>
    </FullScreenContainer>
  )
}

const FullScreenContainer = styled(PopUpContainer)`
  background-color: rgba(255, 255, 255, 0.75);
`

const Container = styled.div`
  ${mixins.flex('center', 'center')}
  flex-direction: column;

  width: ${sizes.autoPlay.width.css};
  height: fit-content;
  padding: 1.35em 1em;

  font-size: ${fontSizes.autoPlay.message.css};

  background-color: ${colors.autoPlayPopUpBg};
  border: ${sizes.autoPlay.border.ccs} solid ${colors.popUpColor};
  border-radius: ${sizes.autoPlay.borderRadius.ccs};
  box-shadow: 0 0 ${sizes.autoPlay.borderRadius.ccs} ${colors.popUpColor};
`

const Message = styled.h2`
  padding-bottom: 1.75em;
  font-size: 1em;
`

const Instruction = styled.small`
  font-size: ${fontSizes.autoPlay.instrucution.css};
`

export default AutoPlayPopUp