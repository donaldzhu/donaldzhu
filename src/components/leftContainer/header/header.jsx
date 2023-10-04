import { forwardRef } from 'react'
import { styled } from 'styled-components'
import HomeIcon from './homeIcon'
import sizes from '../../../styles/sizes'

const Header = forwardRef(({ callbackRefs, canvasStateRefs }, ref) =>
  <header ref={ref}>
    <HomeIconContainer>
      <HomeIcon
        callbackRefs={callbackRefs}
        canvasStateRefs={canvasStateRefs} />
    </HomeIconContainer>
  </header>
)

const HomeIconContainer = styled.div`
  padding: ${sizes.homeIconPaddingTop} 0;
`

export default Header