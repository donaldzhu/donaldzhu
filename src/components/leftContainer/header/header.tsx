import styled from 'styled-components'
import { domSizes } from '../../../styles/sizes'
import { GlobalCanvasStates } from '../../canvas/canvasTypes'
import SvgBorder from '../../common/svgBorder'
import HomeIcon from './homeIcon'

const Header = ({ canvasRef, canvasStates }: GlobalCanvasStates) => {
  return (
    <header>
      <HomeIconContainer>
        <HomeIcon
          canvasRef={canvasRef}
          canvasStates={canvasStates} />
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