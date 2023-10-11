import { useEffect, useRef } from 'react'
import { styled } from 'styled-components'
import Header from './header/header'
import Footer from './footer/footer'
import useCanvas from '../../hooks/useCanvas'
import drawPageBorders from '../../p5/sketches/drawPageBorder'
import mixins from '../../styles/mixins'
import { sizes } from '../../styles/sizes'
import Svg from '../common/svg'
import colors from '../../styles/colors'

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

  const stroke = sizes.sidebar.border.value

  return (
    <Container>
      <ContentContainer>
        <Header
          ref={headerRef}
          callbackRefs={front}
          canvasStateRefs={canvasStateRefs} />
        <SidebarContainer ref={sidebarRef}>
          {sidebar || <div />}
        </SidebarContainer>
        <Footer ref={footerRef} />
      </ContentContainer>
      <div>
        {/* <SvgContainer>
          <Svg w={stroke} h={stroke}>
            <line
              x1='0'
              y1={stroke / 2}
              x2={sizers.sidebar.width.value}
              y2={stroke / 2}
              stroke={colors.border}
              strokeWidth={stroke}
              strokeLinecap='round'
            />
          </Svg>
        </SvgContainer> */}
      </div>
    </Container>
  )
}

const SidebarContainer = styled.div`
  flex: auto;
  padding-right: ${sizes.sidebar.padding.right.css};
  overflow: scroll;
  
  &>:first-child {
    margin-top: ${sizes.sidebar.padding.vert.css};
  }
`

const Container = styled.div`
  ${mixins.fixed()}
  width: ${sizes.sidebar.width.css};
  margin-left: ${sizes.sidebar.padding.left.css};
  z-index: 2;
  
  &, & > div {
    ${mixins.flex()}
    height: 100%;
  }

  > div  {
    flex-direction: column;
  }
`

const ContentContainer = styled.div`

`

const SvgContainer = styled.div`
  height: fit-content;

  svg {
    overflow: visible;
    display: block;
  }
`

export default LeftContainer