import { useRef } from 'react'
import styled from 'styled-components'
import useCanvas from '../../hooks/useCanvas'
import drawMainSketch from '../../p5/sketches/drawMainSketch'
import mixins from '../../styles/mixins'
import { vw } from '../../utils/sizeUtils'

const HomeMobile = () => {
  const placeholderRef = useRef<HTMLDivElement>(null)
  useCanvas(() => drawMainSketch({ placeholderRef }))

  return (
    <>
      <MainSketchPlaceHolder ref={placeholderRef} />
      <div>

      </div>
    </>
  )
}

const MainSketchPlaceHolder = styled.div`
  outline: red 1px solid;
  ${mixins
    .chain()
    .squared(vw(100))
    .fixed()}
`

export default HomeMobile