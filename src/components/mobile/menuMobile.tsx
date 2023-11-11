import styled from 'styled-components'
import { Link } from 'react-router-dom'
import mixins from '../../styles/mixins'
import colors from '../../styles/colors'
import { domSizes } from '../../styles/sizes'
import { fontFamilies } from '../../styles/fonts'
import { LinkPath, LinkText } from '../../data/links'
import { typedKeys } from '../../utils/commonUtils'

const MenuMobile = () => {
  return (
    <Container>
      <MenuItemList>
        {typedKeys(LinkText).map(name =>
          <li key={name}>
            <Link to={LinkPath[name]}>{LinkText[name]}</Link>
          </li>)}
      </MenuItemList>
    </Container>
  )
}

const Container = styled.nav`
  ${mixins.chain()
    .fullscreen()
    .highZIndex(2)
    .fixed()}

  // TODO abstract to mixin?
  width: ${domSizes.mobile.app.width.css};
  padding: 0 ${domSizes.mobile.app.margin.css};
  background-color: ${colors.background};
  font-family: ${fontFamilies.sansFont};
  font-weight: bold;
  text-transform: uppercase;
  font-size: 2.3rem;

`

const MenuItemList = styled.ul`
  ${mixins.innerMargin('1.75rem')}
  position: relative;
  top: 32dvh;
`

export default MenuMobile