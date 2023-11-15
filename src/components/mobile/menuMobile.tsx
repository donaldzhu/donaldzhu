import styled from 'styled-components'
import { useLocation } from 'react-router-dom'
import mixins from '../../styles/mixins'
import colors from '../../styles/colors'
import { domSizes } from '../../styles/sizes'
import { fontFamilies } from '../../styles/fonts'
import { LinkPath, LinkText } from '../../data/links'
import { typedKeys } from '../../utils/commonUtils'
import Anchor from '../common/anchor'

interface MenuItemProps {
  $isHighlighted: boolean
}

const MenuMobile = () => {
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
    .fixed()}

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

const Menuitem = styled.li<MenuItemProps>`
  color: ${({ $isHighlighted }) => $isHighlighted ? colors.activeElem : 'inherit'};
`

export default MenuMobile