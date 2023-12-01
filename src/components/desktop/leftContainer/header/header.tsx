import styled from 'styled-components'
import { domSizes } from '../../../../styles/sizes'
import SvgBorder from '../../../common/svgBorder'
import HomeIcon from './homeIcon'
import type { Device } from '../../../../utils/breakptTypes'
import type { GlobalCanvasStates } from '../../../common/canvas/canvasTypes'

const Header = ({ canvasRef, canvasStates }: GlobalCanvasStates<Device.Desktop>) => {
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