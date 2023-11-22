import { useRef } from 'react'
import { Outlet, useOutletContext } from 'react-router-dom'
import styled from 'styled-components'
import useCanvas from '../../../hooks/useCanvas'
import usePreloadQueue from '../../../hooks/usePreloadQueue'
import drawMainSketch from '../../../p5/sketches/drawMainSketch'
import mixins from '../../../styles/mixins'
import { domSizes } from '../../../styles/sizes'
import Size from '../../../utils/helpers/size'
import type { Device } from '../../../utils/queryUtil'

const PageWithMainSketch = () => {
  const placeholderRef = useRef<HTMLDivElement>(null)
  const setupDone = useCanvas<Device.desktop>(() =>
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

const leftContainerWidth = domSizes.desktop.sidebar.width.add(domSizes.desktop.sidebar.padding.left)
const MainSketchPlaceHolder = styled.div`
  ${mixins.fixed({ left: leftContainerWidth.css })}
  width: ${Size.subFromFullWidth(leftContainerWidth).css};
  height: 100%;
`

export default PageWithMainSketch