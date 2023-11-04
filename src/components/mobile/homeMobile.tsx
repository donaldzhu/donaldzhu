import styled from 'styled-components'
import { useOutletContext } from 'react-router-dom'
import useCanvas from '../../hooks/useCanvas'
import drawMobileSketch from '../../p5/sketches/drawMobileSketch'
import mixins from '../../styles/mixins'
import { domSizes } from '../../styles/sizes'
import colors from '../../styles/colors'
import { fontParams, fontSizes } from '../../styles/fonts'
import { Device } from '../../utils/queryUtil'
import { ReactComponent as GyroSvg } from '../../assets/gyroscope/gyro_3.svg'

import { em } from '../../utils/sizeUtils'
import { PageMobileContext } from './mobileType'

interface StyledGyroButtonProps {
  $isEnabled: boolean
}

const HomeMobile = () => {
  const { canvasStates, handleGyroButtonClick } = useOutletContext<PageMobileContext>()
  const { motionSettings, isGyroEnabled } = canvasStates


  useCanvas<Device.mobile>(drawMobileSketch)
  return (
    <>
      {motionSettings?.isUsable !== false &&
        <GyroButtonContainer>
          <GyroEnableButton
            onTouchEnd={handleGyroButtonClick}
            $isEnabled={!!isGyroEnabled}>
            Enable Gyroscope
          </GyroEnableButton>
          <GyroToolTip $isEnabled={!!isGyroEnabled}>
            (Tilt Your Phone)
          </GyroToolTip>
        </GyroButtonContainer>}
    </>
  )
}

const svgHeight = em(1.325)
const padding = em(0.5)
const transitionTime = '0.16s'
const GyroButtonContainer = styled.div`
  ${mixins.chain()
    .flex('center', 'center')
    .highZIndex(1)}
  flex-direction: column;
  position: absolute;
  width: 100%;
  font-size: ${fontSizes.mobile.home.button.css};
  top: ${domSizes.mobile.home.button.top.css};
`

const GyroButton = styled.button`
  padding: ${padding} 0.7em;
  word-spacing: -0.3ch;

  font-weight: ${fontParams.semiBold};
  background-color: ${colors.background};
  height: ${svgHeight};
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
  opacity: ${({ $isEnabled }) => $isEnabled ? 0 : 1};
  border: ${domSizes.mobile.home.button.border.css} solid currentColor;
  border-radius: ${domSizes.mobile.home.button.borderRadius.css};
`

const GyroToolTip = styled(GyroButton) <StyledGyroButtonProps>`
  ${mixins.slant()}
  position: relative;
  top: calc(-${svgHeight} - ${padding} * 2 - ${domSizes.mobile.home.button.border.mult(2).css});
  pointer-events: none;
  transition: opacity ${transitionTime} ${transitionTime};
  opacity: ${({ $isEnabled }) => $isEnabled ? 1 : 0};
`

export default HomeMobile