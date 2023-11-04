import styled from 'styled-components'
import { domSizes } from '../../../styles/sizes'
import { GlobalCanvasStates } from '../../canvas/canvasTypes'
import { Device } from '../../../utils/queryUtil'
import SvgBorder from '../../common/svgBorder'
import HomeIcon from './homeIcon'

const Header = ({ canvasRef, canvasStates }: GlobalCanvasStates<Device.desktop>) => {
  return (
    <header>
      <HomeIconContainer>
        <HomeIcon
          canvasRef={canvasRef}
          canvasStates={canvasStates} />
        <SvgBorder
          size={domSizes.desktop.sidebar.width}
          isVertical={false} />
      </HomeIconContainer>
    </header>
  )
}

const HomeIconContainer = styled.div`
  padding-top: ${domSizes.desktop.homeIcon.padding.vert.css};
`

export default Header