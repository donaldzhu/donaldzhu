import { useEffect, useRef } from 'react'
import { styled } from 'styled-components'
import Header from './header/header'
import Footer from './footer/footer'
import SvgBorder from '../common/svgBorder'
import mixins from '../../styles/mixins'
import { domSizes } from '../../styles/sizes'

const LeftContainer = ({ sidebar, canvasRef, canvasStateRefs }) => {
  const sidebarRef = useRef()
  useEffect(() => {
    const sidebar = sidebarRef.current
    if (sidebar) sidebar.scroll(0, 0)
  }, [sidebar])

  const { borderHeights } = domSizes.sidebar
  return (
    <Container>
      <ContentContainer>
        <Header
          canvasRef={canvasRef}
          canvasStateRefs={canvasStateRefs} />
        <SidebarContainer ref={sidebarRef}>
          {sidebar || <div />}
        </SidebarContainer>
        <Footer />
      </ContentContainer>
      <BorderContainer>
        <VerticalSvgBorder
          size={borderHeights.header}
          isVertical={true} />
        <VerticalSvgBorder
          size={borderHeights.main}
          isVertical={true} />
        <VerticalSvgBorder
          size={borderHeights.footer}
          isVertical={true} />
      </BorderContainer>
    </Container>
  )
}

const SidebarContainer = styled.div`
  flex: auto;
  padding-right: ${domSizes.sidebar.padding.right.css};
  overflow: scroll;
  
  &>:first-child {
    margin-top: ${domSizes.sidebar.padding.vert.css};
  }
`

const ContentContainer = styled.div``

const Container = styled.div`
  ${mixins.fixed()}
  width: ${domSizes.sidebar.width.css};
  margin-left: ${domSizes.sidebar.padding.left.css};
  z-index: 2;
  
  &, & > ${ContentContainer} {
    ${mixins.flex()}
    height: 100%;
  }

  > div  {
    flex-direction: column;
  }
`

const BorderContainer = styled.div`
  ${mixins.flex('initial', 'space-between')}
`

const VerticalSvgBorder = styled(SvgBorder)`
  position: relative;
  left: ${domSizes.sidebar.border.mult(-0.5).css};
`

export default LeftContainer