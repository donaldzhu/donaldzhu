import { useRef } from 'react'
import { Outlet, useOutletContext } from 'react-router-dom'
import styled from 'styled-components'
import useCanvas from '../../hooks/useCanvas'
import usePreloadQueue from '../../hooks/usePreloadQueue'
import drawMainSketch from '../../p5/sketches/drawMainSketch'
import { domSizes } from '../../styles/sizes'
import mixins from '../../styles/mixins'
import Size from '../../utils/helpers/size'

const PageWithMainSketch = () => {
  const placeholderRef = useRef<HTMLDivElement>(null)
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

const leftContainerWidth = domSizes.sidebar.width.add(domSizes.sidebar.padding.left)
const MainSketchPlaceHolder = styled.div`
  ${mixins.fixed({ left: leftContainerWidth.css })}
  width: ${Size.subFromFullWidth(leftContainerWidth).css};
`

export default PageWithMainSketch