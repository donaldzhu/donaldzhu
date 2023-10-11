import { forwardRef } from 'react'
import { styled } from 'styled-components'
import HomeIcon from './homeIcon'
import { sizes } from '../../../styles/sizes'
import SvgBorder from '../../common/svgBorder'

const Header = forwardRef(function Header({ canvasRef, canvasStateRefs }, ref) {
  return (
    <header ref={ref}>
      <HomeIconContainer>
        <HomeIcon
          canvasRef={canvasRef}
          canvasStateRefs={canvasStateRefs} />
        <SvgBorder
          size={sizes.sidebar.width}
          isVertical={false} />
      </HomeIconContainer>
    </header>
  )
})

const HomeIconContainer = styled.div`
  padding-top: ${sizes.homeIcon.padding.vert.css};
`

export default Header