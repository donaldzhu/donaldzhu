import { TouchEvent, useState } from 'react'
import { Outlet } from 'react-router-dom'
import _ from 'lodash'
import useGlobalCanvas from '../../hooks/useGlobalCanvas'
import GlobalCanvas from '../canvas/globalCanvas'
import { addEventListener } from '../../utils/reactUtils'
import { PageProps } from '../pageWrappers/pageTypes'
import useMotion from '../../hooks/useMotion'
import usePhysics from '../../hooks/usePhysics'
import useMemoRef from '../../hooks/useMemoRef'
import { PageMobileContext } from './mobileType'

const PageMobile = ({ canAutoPlay }: PageProps) => {
  const engine = usePhysics()
  const canvasRef = useGlobalCanvas()
  const [isGyroEnabled, setIsGyroEnabled] = useState(false)

  const {
    motionSettings,
    gimbalRef,
    getPermission
  } = useMotion()

  const motionSettingsRef = useMemoRef(() => motionSettings, [motionSettings])
  const isGyroEnabledRef = useMemoRef(() => isGyroEnabled, [isGyroEnabled])

  const handleGyroButtonClick = (e: TouchEvent<HTMLButtonElement>) => {
    if (isGyroEnabled) return e.preventDefault()
    if (getPermission)
      Promise.resolve(getPermission())
        .then(status => setIsGyroEnabled(status === 'granted'))
    else setIsGyroEnabled(false)
  }

  const canvasStates = {
    motionSettings,
    motionSettingsRef,
    isGyroEnabled,
    isGyroEnabledRef,
    gimbalRef,
    engine
  }

  return (
    <>
      <GlobalCanvas
        canvasRef={canvasRef}
        canvasStates={{ engine }} />
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