import { ReactNode, useEffect, useRef } from 'react'
import styled from 'styled-components'
import mixins from '../../styles/mixins'
import { domSizes } from '../../styles/sizes'
import { GlobalCanvasStates } from '../canvas/canvasTypes'
import SvgBorder from '../common/svgBorder'
import Footer from './footer/footer'
import Header from './header/header'

type LeftContainerProps = {
  sidebar: ReactNode | undefined
} & GlobalCanvasStates

const LeftContainer = ({ sidebar, canvasRef, canvasStateRefs }: LeftContainerProps) => {
  const sidebarRef = useRef<HTMLDivElement>(null)
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
          {sidebar ?? <div />}
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
  position: relative;

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