import styled from 'styled-components'
import { Link } from 'react-router-dom'
import mixins from '../../styles/mixins'
import { domSizes } from '../../styles/sizes'
import Size from '../../utils/helpers/size'
import { fontFamilies, fontSizes } from '../../styles/fonts'
import MobileButton from '../common/mobileButton'

interface NavMobileProps {
  isShown: boolean
  handleClick: (shouldShow?: boolean) => void
}

const NavMobile = ({ isShown, handleClick }: NavMobileProps) => {
  return (
    <Container>
      <HomeLink to='/' onClick={() => handleClick(false)}>D<b>ZHU</b></HomeLink>
      <MenuLink onClick={() => handleClick()}>
        {isShown ? 'close' : 'menu'}
      </MenuLink>
    </Container>
  )
}

const Container = styled.header`
  ${mixins
    .chain()
    .highZIndex(3)
    .flex('center', 'space-between')}
  position: absolute;
  width: ${new Size({ vw: 100 }).sub(domSizes.mobile.app.margin.mult(2)).css};
  padding: ${domSizes.mobile.nav.link.padding.css} 0;
  font-size: ${fontSizes.mobile.nav.mono.css};
  height: ${domSizes.mobile.nav.link.height.css};
`

const HomeLink = styled(Link)`
  font-family: ${fontFamilies.sansFont};
  padding-top: 0.225em;
  font-size: ${fontSizes.mobile.nav.sans.css};
`

const MenuLink = styled(MobileButton)`
  ${mixins.textMono()}
`

export default NavMobile