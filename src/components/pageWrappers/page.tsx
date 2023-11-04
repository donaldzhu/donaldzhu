import { ReactNode, useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import useCanvas from '../../hooks/useCanvas'
import useGlobalCanvas from '../../hooks/useGlobalCanvas'
import usePreload from '../../hooks/usePreload'
import drawCursor from '../../p5/sketches/drawCursor'
import mixins from '../../styles/mixins'
import { typedKeys } from '../../utils/commonUtils'
import GlobalCanvas from '../canvas/globalCanvas'
import AutoPlayPopUp from '../common/autoPlayPopUp'
import { RequiredZoomMediaProps } from '../common/media/mediaTypes'
import ZoomedMedia from '../common/media/zoomedMedia'
import LeftContainer from '../leftContainer/leftContainer'
import Vid from '../common/media/vid'
import { Device } from '../../utils/queryUtil'
import { handleZoomType, PageContextProps, PageProps } from './pageTypes'

const Page = ({ canAutoPlay }: PageProps) => {
  const [sidebar, setSidebar] = useState<ReactNode | undefined>()
  const [zoomMedia, setZoomMedia] = useState<RequiredZoomMediaProps | undefined>()
  const location = useLocation()

  const canvasStates = {
    mousePositionRef: useRef(null),
    hideCursorRef: useRef(false)
  }

  const { vidLoadData, preloadManager } = usePreload(canAutoPlay)

  const handleZoomMedia: handleZoomType = media => setZoomMedia(media)
  const canvasRef = useGlobalCanvas()

  useCanvas<Device.desktop>(drawCursor, { canvasRef, canvasStates: canvasStates })

  useEffect(() => {
    window.scrollTo(0, 0)
    if (zoomMedia) setZoomMedia(undefined)
  }, [location])

  return (
    <>
      <GlobalCanvas
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
      } satisfies PageContextProps} />
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