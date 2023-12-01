import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { usePrevious } from '@uidotdev/usehooks'
import mixins from '../../../styles/mixins'
import useGlobalCanvas from '../../../hooks/useGlobalCanvas'
import GlobalCanvas from '../../common/canvas/globalCanvas'
import useMotion from '../../../hooks/useMotion'
import usePhysics from '../../../hooks/usePhysics'
import { noOverflow } from '../../../utils/reactUtils'
import useMemoRef from '../../../hooks/useMemoRef'
import { validateString } from '../../../utils/commonUtils'
import Header from '../header'
import Menu from '../menu'
import VidLoadContainer from '../../common/media/vidLoadContainer'
import ZoomedMedia from '../../common/media/zoomedMedia'
import type { Device } from '../../../utils/breakptTypes'
import type { MobileContextProps } from './pageTypes'
import type { RouteProps } from '../../routeTypes'
import type { handleZoomMediaType, RequiredZoomMediaProps } from '../../common/media/mediaTypes'

interface StyledGlobalCanvasProps {
  $menuIsShown: boolean
}

const Page = ({ mediaSettings }: RouteProps) => {
  const { canAutoPlay, vidLoadData, preloadManager } = mediaSettings
  const location = useLocation()
  const prevLocation = usePrevious(location)
  const engine = usePhysics()
  const canvasRef = useGlobalCanvas()
  const [gyroStates, setGyroStates] = useState({
    isEnabled: false, hasRequested: false
  })
  const [menuIsShown, setMenuIsShown] = useState(false)
  const [shouldFade, setShouldFade] = useState(true)
  const [shouldHideGyro, setShouldHideGyro] = useState(false)
  const [zoomMedia, setZoomMedia] = useState<RequiredZoomMediaProps | undefined>()

  const {
    motionSettings,
    gimbalRef,
    getPermission
  } = useMotion()

  const motionSettingsRef = useMemoRef(() => motionSettings, [motionSettings])
  const gyroStatesRef = useMemoRef(() => gyroStates, [gyroStates])

  const handleGyroButtonClick = () => {
    if (getPermission) Promise.resolve(getPermission())
      .then(status => setGyroStates({
        hasRequested: true,
        isEnabled: status === 'granted'
      }))
    else setGyroStates({
      hasRequested: false,
      isEnabled: false
    })
  }

  const handleZoomMedia: handleZoomMediaType = media => setZoomMedia(media)

  useEffect(() => {
    if (menuIsShown) return noOverflow()
  }, [menuIsShown])
  useEffect(() => {
    window.scrollTo(0, 0)
    setMenuIsShown(false)
    setShouldFade(true)
    if (gyroStates.isEnabled && prevLocation.pathname !== location.pathname)
      setShouldHideGyro(true)
  }, [location])

  const handleMenuClick = (shouldShow?: boolean) => setMenuIsShown(shouldShow ?? !menuIsShown)

  const canvasStates = {
    motionSettings,
    motionSettingsRef,
    gyroStates,
    gyroStatesRef,
    gimbalRef,
    engine
  }

  return (
    <Container $menuIsShown={menuIsShown}>
      <Header isShown={menuIsShown} handleClick={handleMenuClick} />
      {menuIsShown && <Menu />}
      {zoomMedia && <ZoomedMedia
        zoomMedia={zoomMedia}
        handleUnzoom={() => setZoomMedia(undefined)} />}
      <AnimationContainer
        $shouldFade={shouldFade}
        onAnimationEnd={() => setShouldFade(false)}>
        <StyledGlobalCanvas
          canvasRef={canvasRef}
          canvasStates={{ engine }}
          $menuIsShown={menuIsShown} />
        <Outlet context={{
          canAutoPlay,
          canvasRef,
          canvasStates,
          shouldHideGyro,
          handleZoomMedia,
          preloadManager,
          handleGyroButtonClick
        } satisfies MobileContextProps} />
      </AnimationContainer>
      <VidLoadContainer
        vidLoadData={vidLoadData}
        canAutoPlay={canAutoPlay} />
    </Container>
  )
}

const AnimationContainer = styled.div<{ $shouldFade: boolean }>`
  ${({ $shouldFade }) => validateString($shouldFade, `
    @keyframes fadeIn {
      from {
        opacity: 0;
      } to {
        opacity: 1;
      }
    }
    animation: fadeIn 0.5s ease-in-out;
  `)}
`

const Container = styled.div<StyledGlobalCanvasProps>`
  &, &>${AnimationContainer} {
    ${mixins.flex('center')}
    flex-direction: column;
    width: 100%;
  }
`

const StyledGlobalCanvas = styled(GlobalCanvas<Device.Mobile>) <StyledGlobalCanvasProps>`
  ${mixins.fixed()}
  ${({ $menuIsShown }) => validateString(!$menuIsShown, mixins.highZIndex(4))}
`

export default Page