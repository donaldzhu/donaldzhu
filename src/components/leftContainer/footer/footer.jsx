import { Fragment, forwardRef } from 'react'
import { styled } from 'styled-components'
import FooterLink from './footerLink'
import mixins from '../../../styles/mixins'
import { sizes } from '../../../styles/sizes'
import { fontSizes } from '../../../styles/fonts'
import colors from '../../../styles/colors'
import SvgBorder from '../../common/svgBorder'

const nameTextMap = {
  work: 'WORK',
  process: 'HOW I WORK',
  contact: 'CONTACT'
}

const Footer = forwardRef(function Footer(_, ref) {
  return (
    <FooterContainer ref={ref}>
      <SvgBorder
        size={sizes.sidebar.width}
        isVertical={false} />
      <FooterLinkContainer>
        {Object.keys(nameTextMap).map((name, i) =>
          <Fragment key={name}>
            {!!i && <FooterDelimiter>●</FooterDelimiter>}
            <FooterLink path={`/${name}`}>{nameTextMap[name]}</FooterLink>
          </Fragment>)}
      </FooterLinkContainer>
    </FooterContainer >
  )
})

const FooterContainer = styled.footer`
  ${mixins.highZIndex(4)}
  bottom: 0;
  font-size: ${fontSizes.footer.link.css};
`

const FooterLinkContainer = styled.div`
  ${mixins.flex('center', 'space-between')} 
  width: 100%;
  box-sizing: border-box;
 
  padding: ${sizes.footer.padding.top.sub(sizes.footer.link.padding).css} 0;
  padding-right: ${sizes.sidebar.padding.right.css};
 
  font-size: ${fontSizes.footer.link.css};
`

const FooterDelimiter = styled.div` 
  align-self: center;
  color: ${colors.footer};
  ${mixins.noSelect()}
`

export default Footer
