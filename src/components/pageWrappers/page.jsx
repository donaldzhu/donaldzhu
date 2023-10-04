import { useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import LeftContainer from '../leftContainer/leftContainer'
import GlobalCanvas from '../canvas/globalCanvas'
import ZoomedMedia from '../common/media/zoomedMedia'
import Media from '../common/media/media'
import useGlobalCanvas from '../../hooks/useGlobalCanvas'
import useCanvas from '../../hooks/useCanvas'
import usePreload from '../../hooks/usePreload'
import drawCursor from '../../p5/sketches/drawCursor'
import mixins from '../../styles/mixins'
import { SINGLE_MEDIA_TYPES } from '../../utils/helpers/preloader/preloadUtils'
import useCanAutoPlay from '../../hooks/useCanAutoPlay'
import AutoPlayPopUp from '../common/autoPlayPopUp'

const Page = () => {
  const [sidebar, setSidebar] = useState()
  const [zoomMedia, setZoomMedia] = useState()
  const location = useLocation()


  const allCanvasCallbackRefs = [
    useGlobalCanvas(),
    useGlobalCanvas()
  ]

  const canvasStateRefs = {
    mousePositionRef: useRef(null),
    hideCursorRef: useRef(false)
  }

  const canAutoPlay = useCanAutoPlay()
  const { vidLoadData, preloadManager } = usePreload(canAutoPlay)

  const handleZoomMedia = media => setZoomMedia(media)
  const [front, back] = allCanvasCallbackRefs

  useCanvas(drawCursor, {
    callbackRefs: front,
    canvasStateRefs,
  })

  useEffect(() => {
    window.scrollTo(0, 0)
    if (zoomMedia) setZoomMedia()
  }, [location])


  return (
    <>
      <GlobalCanvas
        callbackRefs={front}
        canvasStateRefs={canvasStateRefs}
        zIndex={99} />
      {zoomMedia && <ZoomedMedia
        zoomMedia={zoomMedia}
        handleUnzoom={() => setZoomMedia()} />}
      {(location.pathname.match(/^\/work/) && canAutoPlay === false) &&
        <AutoPlayPopUp />}
      <LeftContainer
        sidebar={sidebar}
        allCanvasCallbackRefs={allCanvasCallbackRefs}
        canvasStateRefs={canvasStateRefs} />
      <Outlet context={{
        allCanvasCallbackRefs,
        canvasStateRefs,
        sidebar,
        setSidebar,
        zoomMedia,
        handleZoomMedia,
        canAutoPlay,
        preloadManager
      }} />
      <GlobalCanvas
        callbackRefs={back}
        canvasStateRefs={canvasStateRefs} />
      {!!Object.keys(vidLoadData).length &&
        <VidLoadContainer>
          {Object.keys(vidLoadData).map(src => {
            const { onProgress } = vidLoadData[src]
            return <Media
              key={src}
              src={src}
              type={SINGLE_MEDIA_TYPES.video}
              preload='true'
              autoPlay={true}
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