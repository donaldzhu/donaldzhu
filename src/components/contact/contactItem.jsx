import { styled } from 'styled-components'
import ContactCopy from './contactCopy'
import Text from '../common/styled/text'
import Anchor from '../common/anchor'
import { em } from '../../utils/styleUtils'
import mixins from '../../styles/mixins'
import colorConfig from '../../styles/colors'
import { ReactComponent as Qr } from '../../assets/qr.svg'
import contactData from '../../data/contactData'

const ContactItem = ({ data, handleHover, isQrShown }) => {
  const email = contactData
    .find(contact => contact.type === 'email')
    .link
    .replace('mailto:', '')

  return (
    <ItemContainer>
      <LinkContainer to={data.link}>
        <Text>{data.text}</Text>
      </LinkContainer>
      {data.type === 'email' && <ContactCopy content={email} />}
      <QRSvg $isHighlighted={isQrShown} onMouseOver={e => handleHover(e.currentTarget, data)} />
    </ItemContainer >
  )
}


const ItemContainer = styled.li`
  ${mixins.flex('center', 'initial')}
`

const LinkContainer = styled(Anchor)`
  width: fit-content;
  ${mixins.underline()}
  text-decoration-thickness: 0.0765em;
`

const QRSvg = styled(Qr)`
  ${mixins.squared(em(1))}
  display: inline-block;
  margin-left: 0.25em;
  color: ${({ $isHighlighted }) => $isHighlighted ? colorConfig.activeElem : colorConfig.defaultText}; 
`

export default ContactItem
