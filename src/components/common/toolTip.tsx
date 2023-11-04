import _ from 'lodash'
import pointInPolygon from 'point-in-polygon'
import { ReactNode, useContext, useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import styled from 'styled-components'
import { WorkPageContext } from '../../contexts/context'
import colors from '../../styles/colors'
import { fontParams, fontSizes } from '../../styles/fonts'
import mixins from '../../styles/mixins'
import { domSizes, sketchSizes } from '../../styles/sizes'
import { getToolTipPoints, validateString } from '../../utils/commonUtils'
import ElemRect from '../../utils/helpers/rect/elemRect'
import { addEventListener } from '../../utils/reactUtils'
import { em } from '../../utils/sizeUtils'
import { validateRef } from '../../utils/typeUtils'
import { PageContextProps } from '../pageWrappers/pageTypes'
import { WorkPageContextProps } from '../../contexts/contextTypes'


interface ToolTipProps {
  children?: ReactNode
}

interface StyledToolTipProps {
  $isHighlighted: boolean
}

const ToolTip = ({ children }: ToolTipProps) => {
  const [isShown, setIsShown] = useState(false)
  const { toolTipRef, popUpRef } = useContext<WorkPageContextProps>(WorkPageContext)
  const { zoomMedia, canvasStates } = useOutletContext<PageContextProps>()
  const mousePositionRef = canvasStates?.mousePositionRef

  const handleHover = ({ currentTarget }: { currentTarget: HTMLDivElement }) => {
    if (toolTipRef) toolTipRef.current = currentTarget
    setIsShown(true)
  }

  useEffect(() => {
    if (!isShown) return _.noop
    const mouseHandler = () => {
      if (validateRef(toolTipRef) && validateRef(popUpRef)) {
        const toolTip = new ElemRect(toolTipRef, sketchSizes.desktop.toolTip.padding.value)
        const popUp = new ElemRect(popUpRef)

        if (!validateRef(mousePositionRef)) return
        const mousePosition = mousePositionRef.current
        if (
          toolTip.mouseIsOver(mousePosition) ||
          popUp.mouseIsOver(mousePosition) ||
          zoomMedia
        ) return

        const toolTipPoints = getToolTipPoints(toolTip, popUp)
        if (pointInPolygon(mousePositionRef.current, toolTipPoints)) return

        setIsShown(false)
      }
      if (toolTipRef) toolTipRef.current = null
    }

    const removeMouseMove = addEventListener(document, 'mousemove', mouseHandler)
    const removeScroll = addEventListener(document, 'scroll', mouseHandler)
    return () => {
      removeMouseMove()
      removeScroll()
    }
  }, [isShown, zoomMedia])

  return (
    <Container>
      <ToolTipContainer
        onMouseOver={handleHover}
        $isHighlighted={isShown}>
        <p>i</p>
      </ToolTipContainer>
      {isShown &&
        <PopUpContainer ref={popUpRef}>
          {typeof children === 'string' ? <p>{children}</p> : children}
        </PopUpContainer>}
    </Container>
  )
}

const Container = styled.div`
  position: relative;
`

const toolTipSize = em(1.35)
const ToolTipContainer = styled.div<StyledToolTipProps>`
  position: absolute;
  left: calc(${domSizes.desktop.mainContainer.margin.css} * -1 - ${toolTipSize} / 2);
  background-color: ${colors.toolTipBg};
  font-size: ${fontSizes.desktop.toolTip.icon.css};

  ${mixins
    .chain()
    .squared(toolTipSize)
    .noSelect()
    .fontVar({ MONO: 1 })
    .flex('center', 'center')}

  border-radius: 1px;
  outline: ${domSizes.desktop.toolTip.border.css} solid currentColor;

  ${({ $isHighlighted }) => validateString($isHighlighted, `
    color:${colors.activeElem};
    outline: none;
  `)}
`

const PopUpContainer = styled.div`
  width: ${domSizes.desktop.workPage.sidebar.description.maxWidth.mult(0.85).css};
  padding: 0.8em;

  color: ${colors.toolTipColor};
  background-color: ${colors.toolTipBg};

  font-size: ${fontSizes.desktop.toolTip.popUp.css};
  font-weight: ${fontParams.semiLight};
  letter-spacing: -0.012em;
  word-spacing: -0.0225em;

  ${mixins.chain()
    .fixed({
      left: domSizes.desktop.toolTip.left.css,
      bottom: domSizes.desktop.toolTip.bottom.css,
    })
    .slant()
    .innerMargin(domSizes.desktop.text.innerMargin.css)}

  p > b {
    font-family: inherit;
  }

  img {
    width: 100%;
  }

  ::selection {
    background-color: ${colors.activeElem};
  }

  a {
    ${mixins.underline()}
  }
`

export default ToolTip