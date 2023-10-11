import { useRef } from 'react'
import { Outlet, useOutletContext } from 'react-router-dom'
import styled from 'styled-components'
import useCanvas from '../../hooks/useCanvas'
import usePreloadQueue from '../../hooks/usePreloadQueue'
import drawMainSketch from '../../p5/sketches/drawMainSketch'
import { sizes } from '../../styles/sizes'
import mixins from '../../styles/mixins'
import Size from '../../utils/helpers/size'

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

const leftContainerWidth = sizes.sidebar.width.add(sizes.sidebar.padding.left)
const MainSketchPlaceHolder = styled.div`
  ${mixins.fixed({ left: leftContainerWidth.css })}
  width: ${Size.subFromFullpage(leftContainerWidth).css};
`

export default PageWithMainSketch