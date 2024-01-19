import { forwardRef } from 'react'
import styled from 'styled-components'
import mixins from '../../styles/mixins'
import { domSizes } from '../../styles/sizes'
import { fontFamilies, fontSizes } from '../../styles/fonts'
import colors from '../../styles/colors'
import Anchor from '../common/anchor'

interface HeaderProps {
  isShown: boolean
  handleClick: (shouldShow?: boolean) => void
}

const Header = forwardRef<HTMLHeadElement, HeaderProps>(function Header({
  isShown,
  handleClick
}, ref) {
  return (
    <Container ref={ref}>
      <HomeLink to='/' onClick={() => handleClick(false)}>D<b>ZHU</b></HomeLink>
      <MenuLink onClick={() => handleClick()}>
        {isShown ? 'close' : 'menu'}
      </MenuLink>
    </Container>
  )
})

const Container = styled.header`
  ${mixins
    .chain()
    .highZIndex(3)
    .mobileBody()
    .flex('center', 'space-between')}
  position: fixed;
  background-color: ${colors.background};
  padding-top: ${domSizes.mobile.header.link.padding.css};
  padding-bottom: ${domSizes.mobile.header.link.padding.css};
  font-size: ${fontSizes.mobile.nav.mono.css};
  height: ${domSizes.mobile.header.link.height.css};
`

const HomeLink = styled(Anchor)`
  font-family: ${fontFamilies.sansFont};
  padding-top: 0.225em;
  font-size: ${fontSizes.mobile.nav.sans.css};
`

const MenuLink = styled.button`
  ${mixins.textMono()}
`

export default Header