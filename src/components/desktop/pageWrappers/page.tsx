import { useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import useCanvas from '../../../hooks/useCanvas'
import useGlobalCanvas from '../../../hooks/useGlobalCanvas'
import drawCursor from '../../../p5/sketches/drawCursor'
import mixins from '../../../styles/mixins'
import { typedKeys } from '../../../utils/commonUtils'
import GlobalCanvas from '../../common/canvas/globalCanvas'
import AutoPlayPopUp from '../../common/autoPlayPopUp'
import ZoomedMedia from '../../common/media/zoomedMedia'
import LeftContainer from '../leftContainer/leftContainer'
import Vid from '../../common/media/vid'
import type { Device } from '../../../utils/queryUtil'
import type { ReactNode } from 'react'
import type { RequiredZoomMediaProps } from '../../common/media/mediaTypes'
import type { handleZoomType, DesktopContextProps } from './pageTypes'
import type { RouteProps } from '../../routeTypes'


const TypedGlobalCanvas = GlobalCanvas<Device.desktop>
const Page = ({ mediaSettings }: RouteProps) => {
  const { canAutoPlay, vidLoadData, preloadManager } = mediaSettings
  const [sidebar, setSidebar] = useState<ReactNode | undefined>()
  const [zoomMedia, setZoomMedia] = useState<RequiredZoomMediaProps | undefined>()
  const location = useLocation()

  const canvasStates = {
    mousePositionRef: useRef(null),
    hideCursorRef: useRef(false)
  }

  const handleZoomMedia: handleZoomType = media => setZoomMedia(media)
  const canvasRef = useGlobalCanvas()

  useCanvas<Device.desktop>(drawCursor, { canvasRef, canvasStates })

  useEffect(() => {
    window.scrollTo(0, 0)
    if (zoomMedia) setZoomMedia(undefined)
  }, [location])

  return (
    <>
      <TypedGlobalCanvas
        canvasRef={canvasRef}
        canvasStates={canvasStates} />
      {zoomMedia && <ZoomedMedia
        zoomMedia={zoomMedia}
        handleUnzoom={() => setZoomMedia(undefined)} />}
      {(location.pathname.match(/^\/work/) && canAutoPlay === false) &&
        <AutoPlayPopUp />}
      <LeftContainer
        sidebar={sidebar}
        canvasRef={canvasRef}
        canvasStates={canvasStates} />
      <Outlet context={{
        canvasRef,
        canvasStates,
        sidebar,
        setSidebar,
        zoomMedia,
        handleZoomMedia,
        canAutoPlay,
        preloadManager
      } satisfies DesktopContextProps} />
      {!!Object.keys(vidLoadData).length &&
        <VidLoadContainer>
          {typedKeys(vidLoadData).map(src => {
            const { onProgress } = vidLoadData[src]
            return <Vid
              key={src}
              src={src}
              preload='true'
              autoPlay={true}
              canAutoPlay={canAutoPlay}
              useNativeControl={true}
              onProgress={onProgress}
              onCanPlayThrough={onProgress}
              onTimeUpdate={onProgress} />
          })}
        </VidLoadContainer>}
    </>
  )
}

const VidLoadContainer = styled.div`
  ${mixins.fixed()}
  visibility: hidden;
`


export default Page