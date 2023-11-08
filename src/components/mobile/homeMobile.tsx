import styled from 'styled-components'
import { useOutletContext } from 'react-router-dom'
import useCanvas from '../../hooks/useCanvas'
import drawMobileSketch from '../../p5/sketches/drawMobileSketch'
import mixins from '../../styles/mixins'
import { domSizes } from '../../styles/sizes'
import colors from '../../styles/colors'
import { fontParams, fontSizes } from '../../styles/fonts'
import { Device } from '../../utils/queryUtil'
import { em } from '../../utils/sizeUtils'
import TextContainer from '../common/styled/textContainer'
import Text from '../common/styled/text'
import { PageMobileContext } from './mobileType'

interface StyledGyroButtonProps {
  $isShown: boolean
}

const HomeMobile = () => {
  const { canvasStates, handleGyroButtonClick } = useOutletContext<PageMobileContext>()
  const { motionSettings, gyroStates } = canvasStates

  useCanvas<Device.mobile>(drawMobileSketch)
  return (
    <div>
      {motionSettings.hasMotion &&
        <GyroButtonContainer>
          <GyroEnableButton
            onTouchEnd={handleGyroButtonClick}
            $isShown={!!gyroStates.hasRequested}>
            Enable Gyroscope
          </GyroEnableButton>
          <GyroToolTip $isShown={!!gyroStates.hasRequested}>
            {gyroStates.isEnabled ?
              '(Tilt Your Phone)' :
              'Permission Denied :('}
          </GyroToolTip>
        </GyroButtonContainer>}
      <HomeTextContainer>
        <Text>
          <b>DONALD ZHU is a graphic designer based in Toronto, Canada.</b>
        </Text>
        <Text>
          He finished his degree at OCAD University in 2023. His work primarily focuses on
          <i> typography, interaction, and code</i>. In his free time, he likes to work on
          custom typefaces and side web projects.
        </Text>
      </HomeTextContainer>
    </div>
  )
}

const svgHeight = em(1.325)
const transitionTime = '0.125s'

const GyroButtonContainer = styled.div`
  ${mixins.chain()
    .flex('center', 'center')
    .highZIndex(1)}
  flex-direction: column;
 
  width: ${domSizes.mobile.app.width.css};
  position: absolute;
  top: ${domSizes.mobile.home.button.top.css};
 
  font-size: ${fontSizes.mobile.home.button.css};
`

const GyroButton = styled.button`
  padding: ${domSizes.mobile.home.button.padding.css} 0.7em;
  word-spacing: -0.05em;

  font-weight: ${fontParams.semiBold};
  height: ${domSizes.mobile.home.button.height.css};
  background-color: ${colors.background};
  transition: opacity ${transitionTime};
  transition-timing-function: ease-in-out;
  ${mixins.flex('center', 'center', true)}


  > svg {
    ${mixins.squared(svgHeight)}
    fill: currentColor;
    margin-left: 0.375em;
  }
`

const GyroEnableButton = styled(GyroButton) <StyledGyroButtonProps>`
  opacity: ${({ $isShown }) => $isShown ? 0 : 1};
  border: ${domSizes.mobile.home.button.border.css} solid currentColor;
  border-radius: ${domSizes.mobile.home.button.borderRadius.css};
`

const GyroToolTip = styled(GyroButton) <StyledGyroButtonProps>`
  ${mixins.slant()}
  position: relative;
  top: calc(-${svgHeight} - ${domSizes.mobile.home.button.padding.css} * 2 - ${domSizes.mobile.home.button.border.mult(2).css});
  pointer-events: none;
  transition: opacity ${transitionTime} ${transitionTime};
  opacity: ${({ $isShown }) => $isShown ? 1 : 0};
  background-color: transparent;
`

const HomeTextContainer = styled(TextContainer)`
  position: absolute;
  top: ${domSizes.mobile.home.blocker.top.css};
`

export default HomeMobile