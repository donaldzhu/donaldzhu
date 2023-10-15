import { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import colors from '../../../styles/colors'
import { fontFamilies } from '../../../styles/fonts'
import mixins from '../../../styles/mixins'
import { domSizes } from '../../../styles/sizes'
import Anchor from '../../common/anchor'

interface FooterLinkProps {
  path: string,
  children: ReactNode
}

interface StyledFooterLinkProps {
  $isHighlighted: boolean
}

const FooterLink = ({ path, children }: FooterLinkProps) => {
  const location = useLocation()
  return (
    <FooterAnchor
      to={path}
      $isHighlighted={!!location.pathname.match(path)}>
      {children}
    </FooterAnchor>
  )
}

const linkColorMixin = ({ $isHighlighted }: StyledFooterLinkProps) =>
  $isHighlighted ? colors.activeElem : colors.footer
const FooterAnchor = styled(Anchor) <StyledFooterLinkProps>`
  height: 1em;
  padding: ${domSizes.footer.link.padding.css};
  font-family: ${fontFamilies.sansFont};
  font-weight: bold;
  letter-spacing: -0.015em;
  color: ${linkColorMixin};

  ${mixins
    .chain()
    .noSelect()
    .recursiveCenterText()
  }

  &:first-of-type {
    padding-left: 0;
  }

  &:last-of-type {
    padding-right: 0;
  }
`

export default FooterLink