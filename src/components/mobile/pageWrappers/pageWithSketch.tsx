import { Outlet, useOutletContext } from 'react-router-dom'
import styled from 'styled-components'
import drawMobileSketch from '../../../p5/sketches/mobile/drawGyroSketch'
import { domSizes } from '../../../styles/sizes'
import { fontParams, fontSizes } from '../../../styles/fonts'
import colors from '../../../styles/colors'
import mixins from '../../../styles/mixins'
import Canvas from '../../common/canvas/canvas'
import useLocalCanvas from '../../../hooks/useLocalCanvas'
import usePreloadQueue from '../../../hooks/usePreloadQueue'
import type { Device } from '../../../utils/breakptTypes'
import type { MobileContextProps } from './pageTypes'

interface StyledGyroButtonProps {
  $isShown: boolean
}

interface StyledMainContainerProps {
  $isGyroShown: boolean
}

const PageWithSketch = () => {
  const { canvasStates, shouldHideGyro, handleGyroButtonClick } =
    useOutletContext<MobileContextProps>()
  const { motionSettings, gyroStates } = canvasStates
  const { canvasHandlers, setupDone } = useLocalCanvas<Device.Mobile>(drawMobileSketch)

  usePreloadQueue(setupDone, preloadManager =>
    preloadManager.defaultPreload())

  const isGyroShown = motionSettings.hasMotion && !shouldHideGyro
  return (
    <Container>
      <StyledCanvas {...canvasHandlers} />
      {isGyroShown &&
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
      <MainContainer $isGyroShown={isGyroShown}>
        <Outlet context={useOutletContext()} />
      </MainContainer>
    </Container>
  )
}


const transitionTime = '0.125s'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const StyledCanvas = styled(Canvas)`
  ${mixins.fullscreen()}
`

const GyroButtonContainer = styled.div`
  ${mixins.chain()
    .flex('center', 'center')
    .highZIndex(1)}
  flex-direction: column;
  position: absolute;
  top: ${domSizes.mobile.main.button.top.css};
  width: 100%;
  font-size: ${fontSizes.mobile.main.button.css};
`

const GyroButton = styled.button`
  padding: ${domSizes.mobile.main.button.padding.vert.css} 0.7em;
  word-spacing: -0.05em;
  font-weight: ${fontParams.semiBold};
  height: ${domSizes.mobile.main.button.height.css};
  background-color: ${colors.background};
  transition: opacity ${transitionTime};
  transition-timing-function: ease-in-out;
  ${mixins.flex('center', 'center', true)}
`

const GyroEnableButton = styled(GyroButton) <StyledGyroButtonProps>`
  opacity: ${({ $isShown }) => $isShown ? 0 : 1};
  border: ${domSizes.mobile.main.button.border.css} solid currentColor;
  border-radius: ${domSizes.mobile.main.button.borderRadius.css};
`

// TODO: no button for aria purposes
const GyroToolTip = styled(GyroButton) <StyledGyroButtonProps>`
  ${mixins.slant()}
  pointer-events: none;
  transition: opacity ${transitionTime} ${transitionTime};
  opacity: ${({ $isShown }) => $isShown ? 1 : 0};
  background-color: transparent;
  position: relative;
  top: ${domSizes.mobile.main.toolTip.top.mult(-1).css};
`

const MainContainer = styled.div<StyledMainContainerProps>`
  position: absolute;
  top: ${({ $isGyroShown }) => $isGyroShown ?
    domSizes.mobile.home.blocker.top.css :
    domSizes.mobile.main.button.top.css
  };
`

export default PageWithSketch