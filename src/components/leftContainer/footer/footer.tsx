import { Fragment } from 'react'
import styled from 'styled-components'
import colors from '../../../styles/colors'
import { fontSizes } from '../../../styles/fonts'
import mixins from '../../../styles/mixins'
import { domSizes } from '../../../styles/sizes'
import { typedKeys } from '../../../utils/commonUtils'
import SvgBorder from '../../common/svgBorder'
import { LinkText } from '../../../data/links'
import FooterLink from './footerLink'

const Footer = () => {
  return (
    <FooterContainer >
      <SvgBorder
        size={domSizes.desktop.sidebar.width}
        isVertical={false} />
      <FooterLinkContainer>
        {typedKeys(LinkText).map((name, i) =>
          <Fragment key={name}>
            {!!i && <FooterDelimiter>●</FooterDelimiter>}
            <FooterLink path={`/${name}`}>{LinkText[name]}</FooterLink>
          </Fragment>)}
      </FooterLinkContainer>
    </FooterContainer >
  )
}

const FooterContainer = styled.footer`
  ${mixins.highZIndex(4)}
  bottom: 0;
  font-size: ${fontSizes.desktop.footer.link.css};
`

const FooterLinkContainer = styled.div`
  ${mixins.flex('center', 'space-between')}
  width: 100%;
  box-sizing: border-box;

  padding: ${domSizes.desktop.footer.padding.top.sub(domSizes.desktop.footer.link.padding).css} 0;
  padding-right: ${domSizes.desktop.sidebar.padding.right.css};

  font-size: ${fontSizes.desktop.footer.link.css};
`

const FooterDelimiter = styled.div`
  align-self: center;
  color: ${colors.footer};
  ${mixins.noSelect()}
`

export default Footer
