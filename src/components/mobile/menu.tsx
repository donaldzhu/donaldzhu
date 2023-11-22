import styled from 'styled-components'
import { useLocation } from 'react-router-dom'
import mixins from '../../styles/mixins'
import colors from '../../styles/colors'
import { fontFamilies, fontSizes } from '../../styles/fonts'
import { LinkPath, LinkText } from '../../data/links'
import { typedKeys } from '../../utils/commonUtils'
import Anchor from '../common/anchor'
import { domSizes } from '../../styles/sizes'

interface MenuItemProps {
  $isHighlighted: boolean
}

const Menu = () => {
  const location = useLocation()
  return (
    <Container>
      <MenuItemList>
        {typedKeys(LinkText).map(name =>
          <Menuitem
            key={name}
            $isHighlighted={!!location.pathname.match(LinkPath[name])}>
            <Anchor to={LinkPath[name]}>{LinkText[name]}</Anchor>
          </Menuitem>)}
      </MenuItemList>
    </Container>
  )
}

const Container = styled.nav`
  ${mixins.chain()
    .fullscreen()
    .highZIndex(2)
    .mobileBody()
    .flex('center')
    .fixed()}

  background-color: ${colors.background};
  font-family: ${fontFamilies.sansFont};
  font-weight: bold;
  text-transform: uppercase;
  font-size: ${fontSizes.mobile.menu.item.css};

`

const MenuItemList = styled.ul`
  ${mixins.innerMargin(domSizes.mobile.menu.innerMargin.css)}
  position: relative;
`

const Menuitem = styled.li<MenuItemProps>`
  color: ${({ $isHighlighted }) => $isHighlighted ? colors.activeElem : 'inherit'};
`

export default Menu