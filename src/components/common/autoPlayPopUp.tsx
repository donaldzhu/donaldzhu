import styled from 'styled-components'
import colors from '../../styles/colors'
import { fontSizes } from '../../styles/fonts'
import mixins from '../../styles/mixins'
import { domSizes } from '../../styles/sizes'
import PopUpContainer from './popUpContainer'

const AutoPlayPopUp = () => {
  return (
    <FullScreenContainer>
      <Container>
        <Message>
          Your browser has blocked autoplay; dismiss this dialog to activate the website
        </Message>
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

  width: ${domSizes.desktop.autoPlay.width.css};
  height: fit-content;
  padding: 1.35em 1em;

  font-size: ${fontSizes.desktop.autoPlay.message.css};

  background-color: ${colors.autoPlayPopUpBg};
  border: ${domSizes.desktop.autoPlay.border.css} solid currentColor;
  border-radius: ${domSizes.desktop.autoPlay.borderRadius.css};
  box-shadow: 0 0 ${domSizes.desktop.autoPlay.borderRadius.css} currentColor;
`

const Message = styled.h2`
  padding-bottom: 1.75em;
  font-size: 1em;
`

const Instruction = styled.small`
  font-size: ${fontSizes.desktop.autoPlay.instrucution.css};
`

export default AutoPlayPopUp