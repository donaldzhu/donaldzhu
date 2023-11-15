import styled from 'styled-components'
import Text from '../common/styled/text'
import TextContainer from '../common/styled/textContainer'
import contactData from '../../data/contactData'
import Anchor from '../common/anchor'
import mixins from '../../styles/mixins'
import { domSizes } from '../../styles/sizes'
import { em } from '../../utils/sizeUtils'


const ContactMobile = () => {
  return (
    <TextContainer>
      <Text><b>Feel free to contact for inquiry -</b> Toronto, Canada [In person/Remote]</Text>
      <LinkList>
        {contactData.map((data, i) =>
          <li key={i}>
            <LinkContainer to={data.link}>
              <Text>
                {data.displayName}
              </Text>
            </LinkContainer>
          </li>
        )}
      </LinkList>
    </TextContainer>
  )
}


const LinkContainer = styled(Anchor)`
  ${mixins.underline(em(0.09))}
`

const LinkList = styled.ul`
  padding-top: ${domSizes.mobile.contact.linkList.padding.top.css};
`


export default ContactMobile