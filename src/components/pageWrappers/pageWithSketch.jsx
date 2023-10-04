import { useRef } from 'react'
import { Outlet, useOutletContext } from 'react-router-dom'
import styled from 'styled-components'
import useCanvas from '../../hooks/useCanvas'
import usePreloadQueue from '../../hooks/usePreloadQueue'
import drawMainSketch from '../../p5/sketches/drawMainSketch'
import sizes from '../../styles/sizes'
import mixins from '../../styles/mixins'

const PageWithMainSketch = () => {
  const placeholderRef = useRef()
  const setupDone = useCanvas(() =>
    drawMainSketch({ placeholderRef }))

  usePreloadQueue(setupDone, preloadManager =>
    preloadManager.defaultPreload())
  return (
    <>
      <Outlet context={useOutletContext()} />
      <MainSketchPlaceHolder ref={placeholderRef} />
    </>
  )
}

const leftContainerWidth = `calc(${sizes.sidebarWidth} + ${sizes.sidebarPaddingLeft})`
const MainSketchPlaceHolder = styled.div`
  ${mixins.fixed({ left: leftContainerWidth })}
  width: calc(100vw - ${leftContainerWidth});
`

export default PageWithMainSketch