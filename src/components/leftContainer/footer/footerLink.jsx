import { Link, useLocation } from 'react-router-dom'
import { styled } from 'styled-components'
import { fontFamilies } from '../../../styles/fonts'
import colors from '../../../styles/colors'
import mixins from '../../../styles/mixins'
import sizes from '../../../styles/sizes'

const FooterLink = ({ path, children }) => {
  const location = useLocation()
  return (
    <FooterAnchor
      to={path}
      $isHighlighted={location.pathname.match(path)}>
      {children}
    </FooterAnchor>
  )
}

const linkColorMixin = ({ $isHighlighted }) => $isHighlighted ? colors.activeElem : colors.footer
const FooterAnchor = styled(Link)`
  height: fit-content;
  padding: ${sizes.footerLinkPadding};
  font-family: ${fontFamilies.sansFont};  
  font-weight: bold;
  letter-spacing: -0.015em;
  color: ${linkColorMixin};

  ${mixins
    .chain()
    .noSelect()
    .recursiveCenterText()
    .hoverActive()
  }

`

export default FooterLink