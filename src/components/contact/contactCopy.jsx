import { useState } from 'react'
import { styled } from 'styled-components'
import mixins from '../../styles/mixins'
import { fontSizes, fontParams } from '../../styles/fonts'

const ContactCopy = ({ content }) => {
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
  font-size: ${fontSizes.contactCopy};
  margin-left: 0.35em;
  letter-spacing: 0.015em;
  font-weight: ${fontParams.semiBold};
  text-transform: uppercase;  
`

export default ContactCopy