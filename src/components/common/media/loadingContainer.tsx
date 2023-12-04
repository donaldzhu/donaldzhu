import styled from 'styled-components'
import mixins from '../../../styles/mixins'
import colors from '../../../styles/colors'
import { fontSizes } from '../../../styles/fonts'

interface LoadingContainerProps {
  className?: string
}

const LoadingContainer = ({ className }: LoadingContainerProps) => {
  return (
    <Container className={className}>
      <p>loading...</p>
    </Container>
  )
}

const Container = styled.div`
  ${mixins.flex('center', 'center')}
  position: absolute;
  width: 100%;
  font-size: ${fontSizes.mobile.media.loading.css};
  letter-spacing: -0.015em;

  p {
    background-color: ${colors.background};
    padding: 0.2em 1.25em;
    color: ${colors.loadingText};
  }
`

export default LoadingContainer