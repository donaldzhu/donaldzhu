import { useEffect, useRef } from 'react'
import { styled } from 'styled-components'
import Header from './header/header'
import Footer from './footer/footer'
import useCanvas from '../../hooks/useCanvas'
import drawPageBorders from '../../p5/sketches/drawPageBorder'
import mixins from '../../styles/mixins'
import sizes from '../../styles/sizes'

const LeftContainer = ({ sidebar, allCanvasCallbackRefs, canvasStateRefs }) => {
  const headerRef = useRef()
  const footerRef = useRef()
  const sidebarRef = useRef()

  const [front, back] = allCanvasCallbackRefs
  useCanvas(() => drawPageBorders({ headerRef, footerRef, sidebarRef }), {
    callbackRefs: back,
    canvasStateRefs
  })

  useEffect(() => {
    const sidebar = sidebarRef.current
    if (sidebar) sidebar.scroll(0, 0)
  }, [sidebar])

  return (
    <Container>
      <Header
        ref={headerRef}
        callbackRefs={front}
        canvasStateRefs={canvasStateRefs} />
      <SidebarContainer ref={sidebarRef}>
        {sidebar || <div />}
      </SidebarContainer>
      <Footer ref={footerRef} />
    </Container>
  )
}

const SidebarContainer = styled.div`
  flex: auto;
  overflow: scroll;

  > :first-child {
    margin-top: ${sizes.sidebarPaddingVertical};
  }
  
  > :last-child {
    margin-bottom: ${sizes.sidebarPaddingVertical};
  }
`

const Container = styled.div`
  ${mixins
    .chain()
    .fixed()
    .flex()}
  
  flex-direction: column;
  width: ${sizes.sidebarWidth};
  margin-left: ${sizes.sidebarPaddingLeft};
  z-index: 2;

  > header, footer, ${SidebarContainer} {    
    ${mixins.flex('', 'space-between')}    
    padding-right: ${sizes.sidebarPaddingRight};
  }
`

export default LeftContainer