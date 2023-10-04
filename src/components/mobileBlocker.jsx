import styled from 'styled-components'
import PopUpContainer from './common/popUpContainer'

const MobileBlocker = () => {
  return (
    <FullScreenContainer>
      <Message>Mobile site coming soon 👀 Please visit on desktop!</Message>
    </FullScreenContainer>
  )
}

const Message = styled.h1`
  margin: 5vw;
`

const FullScreenContainer = styled(PopUpContainer)`
  ${Message} {
    font-size: 2.75rem;
  }
`

export default MobileBlocker