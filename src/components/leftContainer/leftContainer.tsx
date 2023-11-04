import { ReactNode, useEffect, useRef } from 'react'
import styled from 'styled-components'
import mixins from '../../styles/mixins'
import { domSizes } from '../../styles/sizes'
import { GlobalCanvasStates } from '../canvas/canvasTypes'
import SvgBorder from '../common/svgBorder'
import { Device } from '../../utils/queryUtil'
import Footer from './footer/footer'
import Header from './header/header'

type LeftContainerProps = {
  sidebar: ReactNode | undefined
} & GlobalCanvasStates<Device.desktop>

const LeftContainer = ({ sidebar, canvasRef, canvasStates }: LeftContainerProps) => {
  const sidebarRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const sidebar = sidebarRef.current
    if (sidebar) sidebar.scroll(0, 0)
  }, [sidebar])

  const { borderHeights } = domSizes.desktop.sidebar
  return (
    <Container>
      <ContentContainer>
        <Header
          canvasRef={canvasRef}
          canvasStates={canvasStates} />
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
  padding-right: ${domSizes.desktop.sidebar.padding.right.css};
  overflow: scroll;
  position: relative;

  &>:first-child {
    margin-top: ${domSizes.desktop.sidebar.padding.vert.css};
  }
`

const ContentContainer = styled.div``

const Container = styled.div`
  ${mixins.fixed()}
  width: ${domSizes.desktop.sidebar.width.css};
  margin-left: ${domSizes.desktop.sidebar.padding.left.css};
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
  left: ${domSizes.desktop.sidebar.border.mult(-0.5).css};
`

export default LeftContainer