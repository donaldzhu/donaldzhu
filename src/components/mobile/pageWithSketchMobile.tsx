import { Outlet, useOutletContext } from 'react-router-dom'
import styled from 'styled-components'
import useCanvas from '../../hooks/useCanvas'
import { Device } from '../../utils/queryUtil'
import drawMobileSketch from '../../p5/sketches/drawMobileSketch'
import { domSizes } from '../../styles/sizes'
import { fontParams, fontSizes } from '../../styles/fonts'
import colors from '../../styles/colors'
import mixins from '../../styles/mixins'
import { PageMobileContext } from './mobileType'

interface StyledGyroButtonProps {
  $isShown: boolean
}

interface StyledMainContainerProps {
  $isGyroShown: boolean
}

const PageWithSketchMobile = () => {
  const { canvasStates, shouldHideGyro, handleGyroButtonClick } =
    useOutletContext<PageMobileContext>()
  const { motionSettings, gyroStates } = canvasStates
  useCanvas<Device.mobile>(drawMobileSketch)
  return (
    <Container>
      {motionSettings.hasMotion && !shouldHideGyro &&
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
      <MainContainer $isGyroShown={!shouldHideGyro}>
        <Outlet context={useOutletContext()} />
      </MainContainer>
    </Container>
  )
}


const transitionTime = '0.125s'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: ${domSizes.mobile.app.width.css};
`

const GyroButtonContainer = styled.div`
  ${mixins.chain()
    .flex('center', 'center')
    .highZIndex(1)}
  flex-direction: column;
  position: absolute;
  top: ${domSizes.mobile.home.button.top.css};
  width: ${domSizes.mobile.app.width.css};
  font-size: ${fontSizes.mobile.home.button.css};
`

const GyroButton = styled.button`
  padding: ${domSizes.mobile.home.button.padding.vert.css} 0.7em;
  word-spacing: -0.05em;
  font-weight: ${fontParams.semiBold};
  height: ${domSizes.mobile.home.button.height.css};
  background-color: ${colors.background};
  transition: opacity ${transitionTime};
  transition-timing-function: ease-in-out;
  ${mixins.flex('center', 'center', true)}
`

const GyroEnableButton = styled(GyroButton) <StyledGyroButtonProps>`
  opacity: ${({ $isShown }) => $isShown ? 0 : 1};
  border: ${domSizes.mobile.home.button.border.css} solid currentColor;
  border-radius: ${domSizes.mobile.home.button.borderRadius.css};
`

// TODO: no button for aria purposes
const GyroToolTip = styled(GyroButton) <StyledGyroButtonProps>`
  ${mixins.slant()}
  pointer-events: none;
  transition: opacity ${transitionTime} ${transitionTime};
  opacity: ${({ $isShown }) => $isShown ? 1 : 0};
  background-color: transparent;
  position: relative;
  top: ${domSizes.mobile.home.toolTip.top.mult(-1).css};
`

const MainContainer = styled.div<StyledMainContainerProps>`
  position: absolute;
  top: ${({ $isGyroShown }) => $isGyroShown ?
    domSizes.mobile.home.blocker.top.css :
    domSizes.mobile.home.button.top.css
  };
`

export default PageWithSketchMobile