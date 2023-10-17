import { Outlet } from 'react-router-dom'
import useCanAutoPlay from '../../hooks/useCanAutoPlay'
import useGlobalCanvas from '../../hooks/useGlobalCanvas'
import GlobalCanvas from '../canvas/globalCanvas'

const PageMobile = () => {
  const canAutoPlay = useCanAutoPlay()
  const canvasRef = useGlobalCanvas()

  return (
    <>
      <GlobalCanvas canvasRef={canvasRef} />
      <Outlet context={{
        canAutoPlay,
        canvasRef
      }} />
    </>
  )
}

export default PageMobile