import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import _ from 'lodash'
import useGlobalCanvas from '../../hooks/useGlobalCanvas'
import GlobalCanvas from '../canvas/globalCanvas'
import { addEventListener } from '../../utils/reactUtils'
import { PageProps } from '../pageWrappers/pageTypes'
import useMotion from '../../hooks/useMotion'
import { PageMobileContext } from './mobileType'

const PageMobile = ({ canAutoPlay }: PageProps) => {
  const canvasRef = useGlobalCanvas()

  const {
    motionSettings,
    motionSettingsRef,
    motionRef,
    getPermission
  } = useMotion()

  const { isUsable, needsPermission } = motionSettings
  const canvasStateRefs = {
    motionSettingsRef,
    motionRef,
  }
  useEffect(() => {
    if (isUsable === false || !needsPermission) return _.noop
    return addEventListener(window, 'touchend', getPermission ?? _.noop)
  }, [motionSettings])

  return (
    <>
      <GlobalCanvas canvasRef={canvasRef} />
      <Outlet context={{
        canAutoPlay,
        canvasRef,
        canvasStateRefs
      } satisfies PageMobileContext} />
    </>
  )
}

export default PageMobile