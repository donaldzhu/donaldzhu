import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import _ from 'lodash'
import useGlobalCanvas from '../../hooks/useGlobalCanvas'
import GlobalCanvas from '../canvas/globalCanvas'
import { addEventListener } from '../../utils/reactUtils'
import { PageProps } from '../pageWrappers/pageTypes'
import useMotion from '../../hooks/useMotion'
import usePhysics from '../../hooks/usePhysics'
import { PageMobileContext } from './mobileType'

const PageMobile = ({ canAutoPlay }: PageProps) => {
  const engine = usePhysics()
  const canvasRef = useGlobalCanvas()

  const {
    motionSettings,
    motionSettingsRef,
    gimbalRef,
    getPermission
  } = useMotion()

  const { isUsable, needsPermission } = motionSettings
  const canvasStates = {
    motionSettingsRef,
    gimbalRef,
    engine
  }

  useEffect(() => {
    if (isUsable === false || !needsPermission) return _.noop
    return addEventListener(window, 'touchend', getPermission ?? _.noop)
  }, [motionSettings])

  return (
    <>
      <GlobalCanvas
        canvasRef={canvasRef}
        canvasStates={{ engine }} />
      <Outlet context={{
        canAutoPlay,
        canvasRef,
        canvasStates: canvasStates
      } satisfies PageMobileContext} />
    </>
  )
}

export default PageMobile