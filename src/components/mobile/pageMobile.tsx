import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import useGlobalCanvas from '../../hooks/useGlobalCanvas'
import GlobalCanvas from '../canvas/globalCanvas'
import { PageProps } from '../pageWrappers/pageTypes'
import useMotion from '../../hooks/useMotion'
import usePhysics from '../../hooks/usePhysics'
import useMemoRef from '../../hooks/useMemoRef'
import { PageMobileContext } from './mobileType'
import NavMobile from './navMobile'
import MenuMobile from './menuMobile'

const PageMobile = ({ canAutoPlay }: PageProps) => {
  const engine = usePhysics()
  const canvasRef = useGlobalCanvas()
  const [gyroStates, setGyroStates] = useState({
    isEnabled: false, hasRequested: false
  })
  const [menuIsShown, setMenuIsShown] = useState(false)

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
    <>
      <GlobalCanvas
        canvasRef={canvasRef}
        canvasStates={{ engine }} />
      <NavMobile isShown={menuIsShown} handleClick={handleMenuClick} />
      {menuIsShown && <MenuMobile />}
      <Outlet context={{
        canAutoPlay,
        canvasRef,
        canvasStates,
        handleGyroButtonClick
      } satisfies PageMobileContext} />
    </>
  )
}

export default PageMobile