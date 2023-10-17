import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import useCanAutoPlay from '../../hooks/useCanAutoPlay'
import useGlobalCanvas from '../../hooks/useGlobalCanvas'
import GlobalCanvas from '../canvas/globalCanvas'
import MobileDebugger from './mobileDebugger'
import { PageMobileContext } from './mobileType'

const PageMobile = () => {
  const [debuggerContent, setDebuggerContent] = useState<string[]>([])
  const canAutoPlay = useCanAutoPlay()
  const canvasRef = useGlobalCanvas()

  const mobile = {
    log: (...content: any[]) => {
      console.log(...content)
      if (process.env.NODE_ENV !== 'production')
        return setDebuggerContent(prev =>
          [...prev, ...content.map(item => JSON.stringify(item))])
    }
  }

  return (
    <>
      <MobileDebugger content={debuggerContent} />
      <GlobalCanvas canvasRef={canvasRef} />
      <Outlet context={{
        mobile,
        canAutoPlay,
        canvasRef
      } satisfies PageMobileContext} />
    </>
  )
}

export default PageMobile