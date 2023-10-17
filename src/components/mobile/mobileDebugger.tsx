import { useRef } from 'react'
import styled from 'styled-components'
import _ from 'lodash'
import mixins from '../../styles/mixins'

const MobileDebugger = ({ content }: { content: string[] }) => {
  const containerRef = useRef<HTMLDivElement | null>(null)

  if (process.env.NODE_ENV === 'production' || !content.length) return
  return (
    <Container>
      <LogContainer ref={containerRef}>
        {_.reverse([...content]).map((item, i) => <LogMessage key={i}>{'> '}{item}</LogMessage>)}
      </LogContainer>
    </Container>
  )
}

const Container = styled.div`
  ${mixins
    .chain()
    .fixed()
    .fullscreen()
    .highZIndex(2)}
`

const borderMixin = 'border-top: 1px rgba(0,0,0,0.3) solid;'
const LogContainer = styled.div`
  width: 100%;
  max-height: 30%;
  position: absolute;
  bottom: 0;
  background-color: rgba(235, 235, 235, 0.725);
  overflow-y: scroll;
  display: flex;
  flex-direction: column-reverse;
  ${borderMixin}
`

const LogMessage = styled.p`
  ${mixins.fontVar({ MONO: 1 })}
  width: 100%;
  box-sizing: border-box;
  padding: 0.25em;
  color: black;
  &:not(:last-of-type) {
    ${borderMixin}
  }
`
export default MobileDebugger