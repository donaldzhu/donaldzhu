import { useRef } from 'react'
import styled from 'styled-components'
import useCanvas from '../../../hooks/useCanvas'
import drawHomeIcon from '../../../p5/sketches/drawHomeIcon'
import mixins from '../../../styles/mixins'
import { domSizes } from '../../../styles/sizes'
import { percent } from '../../../utils/sizeUtils'
import { GlobalCanvasStates } from '../../canvas/canvasTypes'
import Anchor from '../../common/anchor'


const HomeIcon = ({ canvasRef, canvasStateRefs }: GlobalCanvasStates) => {
  const placeholderRef = useRef<HTMLDivElement | null>(null)
  const isHoveringRef = useRef(false)

  useCanvas(() => drawHomeIcon({ placeholderRef, isHoveringRef }), {
    canvasRef, canvasStateRefs
  })

  const handleHover = (isOver: boolean) => isHoveringRef.current = isOver

  return (
    <HomeButtonContainer ref={placeholderRef}>
      <HomeButtonLink
        to='/'
        onMouseOver={() => handleHover(true)}
        onMouseOut={() => handleHover(false)} />
    </HomeButtonContainer>
  )
}

const HomeButtonContainer = styled.div`
  ${mixins.flex('center', 'center')}
  width: ${domSizes.homeIcon.width.css};
  height: ${domSizes.homeIcon.height.css};
  position: relative; 
  left: ${domSizes.homeIcon.padding.left.div(-2).css};
  margin-bottom: ${domSizes.homeIcon.padding.vert.css};
`

const HomeButtonLink = styled(Anchor)`
  ${mixins.squared(percent(85))}
  z-index: 2;
  display: block;
`

export default HomeIcon