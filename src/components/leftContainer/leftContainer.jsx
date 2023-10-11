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
import { fontSizes } from '../../styles/fonts'
import Size from '../../utils/helpers/size'

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

  const headerHeight = sizes.homeIcon.padding.vert
    .mult(2)
    .add(sizes.homeIcon.height)
  const footerHeight = sizes.footer.padding.top
    .mult(2)
    .add(fontSizes.footer.link)
  const sidebarHeight = Size.subFromFullHeight(headerHeight)
    .sub(footerHeight)

  const height = headerHeight.sub(sizes.sidebar.borderGap)
  const height2 = footerHeight.sub(sizes.sidebar.borderGap)
  const height3 = sidebarHeight.sub(sizes.sidebar.borderGap.mult(2))
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
      <BorderContainer>
        <SvgContainer>
          <Svg w={stroke} h={height.value}>
            <line
              x1={stroke / 2}
              y1={0}
              x2={stroke / 2}
              y2={height.value}
              stroke={colors.border}
              strokeWidth={stroke}
              strokeLinecap='round'
            />
          </Svg>
        </SvgContainer>
        <SvgContainer>
          <Svg w={stroke} h={height3.value}>
            <line
              x1={stroke / 2}
              y1={0}
              x2={stroke / 2}
              y2={height3.value}
              stroke={colors.border}
              strokeWidth={stroke}
              strokeLinecap='round'
            />
          </Svg>
        </SvgContainer>
        <SvgContainer>
          <Svg w={stroke} h={height2.value}>
            <line
              x1={stroke / 2}
              y1={0}
              x2={stroke / 2}
              y2={height2.value}
              stroke={colors.border}
              strokeWidth={stroke}
              strokeLinecap='round'
            />
          </Svg>
        </SvgContainer>
      </BorderContainer>
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

const ContentContainer = styled.div``

const Container = styled.div`
  ${mixins.fixed()}
  width: ${sizes.sidebar.width.css};
  margin-left: ${sizes.sidebar.padding.left.css};
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

const SvgContainer = styled.div`
  height: fit-content;

  svg {
    overflow: visible;
    display: block;
  }
`

export default LeftContainer