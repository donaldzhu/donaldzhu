import { ReactNode, useEffect, useRef, useState } from 'react'
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
import { MediaFileType } from '../../utils/helpers/preloader/preloadUtils'
import useCanAutoPlay from '../../hooks/useCanAutoPlay'
import AutoPlayPopUp from '../common/autoPlayPopUp'
import { typedKeys } from '../../utils/commonUtils'
import { PageContextProps, handleUnzoom } from './pageTypes'
import { ZoomMediaProps } from '../common/media/mediaTypes'

const Page = () => {
  const [sidebar, setSidebar] = useState<ReactNode | undefined>()
  const [zoomMedia, setZoomMedia] = useState<ZoomMediaProps | undefined>()
  const location = useLocation()

  const canvasStateRefs = {
    mousePositionRef: useRef(null),
    hideCursorRef: useRef(false)
  }

  const canAutoPlay = useCanAutoPlay()
  const { vidLoadData, preloadManager } = usePreload(canAutoPlay)

  const handleZoomMedia: handleUnzoom = media => setZoomMedia(media)
  const canvasRef = useGlobalCanvas()

  useCanvas(drawCursor, { canvasRef, canvasStateRefs })

  useEffect(() => {
    window.scrollTo(0, 0)
    if (zoomMedia) setZoomMedia(undefined)
  }, [location])

  return (
    <>
      <GlobalCanvas
        canvasRef={canvasRef}
        canvasStateRefs={canvasStateRefs} />
      {zoomMedia && <ZoomedMedia
        zoomMedia={zoomMedia}
        handleUnzoom={() => setZoomMedia(undefined)} />}
      {(location.pathname.match(/^\/work/) && canAutoPlay === false) &&
        <AutoPlayPopUp />}
      <LeftContainer
        sidebar={sidebar}
        canvasRef={canvasRef}
        canvasStateRefs={canvasStateRefs} />
      <Outlet context={{
        canvasRef,
        canvasStateRefs,
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
            return <Media
              key={src}
              src={src}
              type={MediaFileType.Video}
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