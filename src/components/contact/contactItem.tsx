import styled from 'styled-components'
import { ReactComponent as Qr } from '../../assets/qr.svg'
import contactData from '../../data/contactData'
import { ContactDataInterface } from '../../data/dataTypes'
import colorConfig from '../../styles/colors'
import mixins from '../../styles/mixins'
import { em } from '../../utils/sizeUtils'
import Anchor from '../common/anchor'
import Text from '../common/styled/text'
import ContactCopy from './contactCopy'
import { handleHoverType } from './contactType'

interface ContactItemProps {
  data: ContactDataInterface
  handleHover: handleHoverType
  isQrShown: boolean
}

interface StyledQrSvgProps {
  $isHighlighted: boolean
}

const ContactItem = ({ data, handleHover, isQrShown }: ContactItemProps) => {
  const emailContact = contactData
    .find(contact => contact.type === 'email')
  if (!emailContact) return
  const email = emailContact.link.replace('mailto:', '')

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

const QRSvg = styled(Qr) <StyledQrSvgProps>`
  ${mixins.squared(em(1))}
  display: inline-block;
  margin-left: 0.25em;
  color: ${({ $isHighlighted }) => $isHighlighted ? colorConfig.activeElem : colorConfig.defaultText}; 
`

export default ContactItem
