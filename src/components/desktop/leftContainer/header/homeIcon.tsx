import { useRef } from 'react'
import styled from 'styled-components'
import useCanvas from '../../../../hooks/useCanvas'
import drawHomeIcon from '../../../../p5/sketches/drawHomeIcon'
import mixins from '../../../../styles/mixins'
import { domSizes } from '../../../../styles/sizes'
import { percent } from '../../../../utils/sizeUtils'
import Anchor from '../../../common/anchor'
import type { GlobalCanvasStates } from '../../../common/canvas/canvasTypes'
import type { Device } from '../../../../utils/queryUtil'


const HomeIcon = ({ canvasRef, canvasStates }: GlobalCanvasStates<Device.desktop>) => {
  const placeholderRef = useRef<HTMLDivElement | null>(null)
  const isHoveringRef = useRef(false)

  useCanvas<Device.desktop>(() => drawHomeIcon({ placeholderRef, isHoveringRef }), {
    canvasRef, canvasStates
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
  width: ${domSizes.desktop.homeIcon.width.css};
  height: ${domSizes.desktop.homeIcon.height.css};
  position: relative;
  left: ${domSizes.desktop.homeIcon.padding.left.div(-2).css};
  margin-bottom: ${domSizes.desktop.homeIcon.padding.vert.css};
`

const HomeButtonLink = styled(Anchor)`
  ${mixins.squared(percent(85))}
  z-index: 2;
  display: block;
`

export default HomeIcon