import styled from 'styled-components'
import { Link } from 'react-router-dom'
import mixins from '../../styles/mixins'
import { domSizes } from '../../styles/sizes'
import Size from '../../utils/helpers/size'
import { fontFamilies, fontSizes } from '../../styles/fonts'
import colors from '../../styles/colors'
import Anchor from '../common/anchor'

interface HeaderMobileProps {
  isShown: boolean
  handleClick: (shouldShow?: boolean) => void
}

const HeaderMobile = ({ isShown, handleClick }: HeaderMobileProps) => {
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
  position: fixed;
  background-color: ${colors.background};
  width: ${new Size({ vw: 100 }).sub(domSizes.mobile.app.margin.mult(2)).css};

  padding: ${domSizes.mobile.header.link.padding.css} 0;
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

export default HeaderMobile