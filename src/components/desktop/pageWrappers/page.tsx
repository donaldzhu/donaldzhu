import { useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import useCanvas from '../../../hooks/useCanvas'
import useGlobalCanvas from '../../../hooks/useGlobalCanvas'
import drawCursor from '../../../p5/sketches/desktop/drawCursor'
import GlobalCanvas from '../../common/canvas/globalCanvas'
import AutoPlayPopUp from '../../common/autoPlayPopUp'
import ZoomedMedia from '../../common/media/zoomedMedia'
import LeftContainer from '../leftContainer/leftContainer'
import VidLoadContainer from '../../common/media/vidLoadContainer'
import type { Device } from '../../../utils/breakptTypes'
import type { ReactNode } from 'react'
import type { RequiredZoomMediaProps, handleZoomMediaType } from '../../common/media/mediaTypes'
import type { DesktopContextProps } from './pageTypes'
import type { RouteProps } from '../../routeTypes'


const TypedGlobalCanvas = GlobalCanvas<Device.Desktop>
const Page = ({ mediaSettings }: RouteProps) => {
  const { canAutoPlay, defaultCanAutoPlay, vidLoadData, preloadManager } = mediaSettings
  const [sidebar, setSidebar] = useState<ReactNode | undefined>()
  const [zoomMedia, setZoomMedia] = useState<RequiredZoomMediaProps | undefined>()
  const { pathname } = useLocation()

  const canvasStates = {
    mousePositionRef: useRef(null),
    hideCursorRef: useRef(false)
  }

  const handleZoomMedia: handleZoomMediaType = media => setZoomMedia(media)
  const canvasRef = useGlobalCanvas()

  useCanvas<Device.Desktop>(drawCursor, { canvasRef, canvasStates })

  useEffect(() => {
    window.scrollTo(0, 0)
    if (zoomMedia) setZoomMedia(undefined)
  }, [pathname])

  return (
    <>
      <TypedGlobalCanvas
        canvasRef={canvasRef}
        canvasStates={canvasStates} />
      {zoomMedia && <ZoomedMedia
        zoomMedia={zoomMedia}
        handleUnzoom={() => setZoomMedia(undefined)} />}
      {(pathname.match(/^\/work/) && canAutoPlay === false) &&
        <AutoPlayPopUp />}
      <LeftContainer
        sidebar={sidebar}
        canvasRef={canvasRef}
        canvasStates={canvasStates} />
      <Outlet context={{
        canvasRef,
        defaultCanAutoPlay,
        canvasStates,
        sidebar,
        setSidebar,
        zoomMedia,
        handleZoomMedia,
        canAutoPlay,
        preloadManager
      } satisfies DesktopContextProps} />
      <VidLoadContainer
        vidLoadData={vidLoadData}
        canAutoPlay={canAutoPlay} />
    </>
  )
}



export default Page