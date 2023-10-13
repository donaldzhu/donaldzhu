import { styled } from 'styled-components'
import HomeIcon from './homeIcon'
import { domSizes } from '../../../styles/sizes'
import SvgBorder from '../../common/svgBorder'
import { GlobalCanvasStates } from '../../canvas/canvasTypes'

const Header = ({ canvasRef, canvasStateRefs }: GlobalCanvasStates) => {
  return (
    <header>
      <HomeIconContainer>
        <HomeIcon
          canvasRef={canvasRef}
          canvasStateRefs={canvasStateRefs} />
        <SvgBorder
          size={domSizes.sidebar.width}
          isVertical={false} />
      </HomeIconContainer>
    </header>
  )
}

const HomeIconContainer = styled.div`
  padding-top: ${domSizes.homeIcon.padding.vert.css};
`

export default Header