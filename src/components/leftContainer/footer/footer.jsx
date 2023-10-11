import { Fragment, forwardRef } from 'react'
import { styled } from 'styled-components'
import FooterLink from './footerLink'
import mixins, { flex } from '../../../styles/mixins'
import { sizes } from '../../../styles/sizes'
import { fontSizers, fontSizes } from '../../../styles/fonts'
import colors from '../../../styles/colors'
import Svg from '../../common/svg'

const nameTextMap = {
  work: 'WORK',
  process: 'HOW I WORK',
  contact: 'CONTACT'
}

const Footer = forwardRef((_, ref) => {
  const stroke = sizes.sidebar.border.value
  return (
    <FooterContainer ref={ref}>
      <SvgContainer>
        <Svg w={sizes.sidebar.width.value} h={stroke}>
          <line
            x1='0'
            y1={stroke / 2}
            x2={sizes.sidebar.width.value}
            y2={stroke / 2}
            stroke={colors.border}
            strokeWidth={stroke}
            strokeLinecap='round'
          />
        </Svg>
      </SvgContainer>
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
  font-size: ${fontSizers.footer.link.css};
`

const SvgContainer = styled.div`
  height: fit-content;

  svg {
    overflow: visible;
    display: block;
  }
`

const FooterLinkContainer = styled.div`
  ${flex('center', 'space-between')} 
  width: 100%;
  box-sizing: border-box;
 
  padding: ${sizes.footer.padding.top.sub(sizes.footer.link.padding).css} 0;
  padding-right: ${sizes.sidebar.padding.right.css};
 
  font-size: ${fontSizers.footer.link.css};
`

const FooterDelimiter = styled.div` 
  align-self: center;
  color: ${colors.footer};
  ${mixins.noSelect()}
`

export default Footer
