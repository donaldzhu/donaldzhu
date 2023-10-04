import { Fragment, forwardRef } from 'react'
import { styled } from 'styled-components'
import FooterLink from './footerLink'
import mixins, { flex } from '../../../styles/mixins'
import sizes from '../../../styles/sizes'
import { fontSizes } from '../../../styles/fonts'
import colors from '../../../styles/colors'

const nameTextMap = {
  work: 'WORK',
  process: 'HOW I WORK',
  contact: 'CONTACT'
}

const Footer = forwardRef((_, ref) =>
  <FooterContainer ref={ref}>
    <FooterLinkContainer>
      {Object.keys(nameTextMap).map((name, i) =>
        <Fragment key={name}>
          {!!i && <FooterDelimiter>●</FooterDelimiter>}
          <FooterLink path={`/${name}`}>{nameTextMap[name]}</FooterLink>
        </Fragment>)}
    </FooterLinkContainer>
  </FooterContainer >
)

const FooterContainer = styled.footer`
  ${mixins.highZIndex(4)}
  bottom: 0;
  padding-right: 1vw;
  align-items: flex-end;
  font-size: ${fontSizes.footerLink};
`

const FooterLinkContainer = styled.div`
  font-size: ${fontSizes.footerLink};
  width: 100%;
  padding: calc(${sizes.footerPaddingTop} - ${sizes.footerLinkPadding}) 0;
  ${flex('center', 'space-between')}  
`

const FooterDelimiter = styled.div`  
  align-self: center;
  color: ${colors.footer};
  ${mixins.noSelect()}
`

export default Footer
