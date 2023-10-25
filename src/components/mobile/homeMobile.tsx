import styled from 'styled-components'

import useCanvas from '../../hooks/useCanvas'
import drawMobileSketch from '../../p5/sketches/drawMobileSketch'
import mixins from '../../styles/mixins'
import { vw } from '../../utils/sizeUtils'


const HomeMobile = () => {
  useCanvas(drawMobileSketch)

  return (
    <>
      <MainSketchPlaceHolder />
      <div>

      </div>
    </>
  )
}

const MainSketchPlaceHolder = styled.div`
  ${mixins
    .chain()
    .squared(vw(100))
    .fixed()}
`

export default HomeMobile