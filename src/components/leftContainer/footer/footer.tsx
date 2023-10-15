import { Fragment } from 'react'
import { styled } from 'styled-components'
import FooterLink from './footerLink'
import mixins from '../../../styles/mixins'
import { domSizes } from '../../../styles/sizes'
import { fontSizes } from '../../../styles/fonts'
import colors from '../../../styles/colors'
import SvgBorder from '../../common/svgBorder'
import { typedKeys } from '../../../utils/commonUtils'

enum NameText {
  work = 'WORK',
  process = 'HOW I WORK',
  contact = 'CONTACT'
}

const Footer = () => {
  return (
    <FooterContainer >
      <SvgBorder
        size={domSizes.sidebar.width}
        isVertical={false} />
      <FooterLinkContainer>
        {typedKeys(NameText).map((name, i) =>
          <Fragment key={name}>
            {!!i && <FooterDelimiter>●</FooterDelimiter>}
            <FooterLink path={`/${name}`}>{NameText[name]}</FooterLink>
          </Fragment>)}
      </FooterLinkContainer>
    </FooterContainer >
  )
}

const FooterContainer = styled.footer`
  ${mixins.highZIndex(4)}
  bottom: 0;
  font-size: ${fontSizes.footer.link.css};
`

const FooterLinkContainer = styled.div`
  ${mixins.flex('center', 'space-between')} 
  width: 100%;
  box-sizing: border-box;
 
  padding: ${domSizes.footer.padding.top.sub(domSizes.footer.link.padding).css} 0;
  padding-right: ${domSizes.sidebar.padding.right.css};
 
  font-size: ${fontSizes.footer.link.css};
`

const FooterDelimiter = styled.div` 
  align-self: center;
  color: ${colors.footer};
  ${mixins.noSelect()}
`

export default Footer
