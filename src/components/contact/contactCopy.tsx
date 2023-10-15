import { useState } from 'react'
import styled from 'styled-components'
import { fontParams, fontSizes } from '../../styles/fonts'
import mixins from '../../styles/mixins'

const ContactCopy = ({ content }: { content: string }) => {
  const [isCopied, setIsCopied] = useState(false)

  const handleClick = () => {
    setIsCopied(true)
    navigator.clipboard.writeText(content)
  }

  return (
    <CopyContainer>
      <button onClick={handleClick}>
        [{isCopied ? 'copied!' : 'copy'}]
      </button>
    </CopyContainer>
  )
}

const CopyContainer = styled.span`
  ${mixins.fontVar({ MONO: 1 })}
  font-size: ${fontSizes.contact.copy.css};
  margin-left: 0.35em;
  letter-spacing: 0.015em;
  font-weight: ${fontParams.semiBold};
  text-transform: uppercase; 
`

export default ContactCopy