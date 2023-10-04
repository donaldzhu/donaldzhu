import { useContext, useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { styled } from 'styled-components'
import _ from 'lodash'
import pointInPolygon from 'point-in-polygon'
import useMemoRef from '../../hooks/useMemoRef'
import { WorkPageContext } from '../../contexts/context'
import { fontSizes, fontParams } from '../../styles/fonts'
import { addEventListener } from '../../utils/reactUtils'
import { getToolTipPoints } from '../../utils/commonUtils'
import ElemRect from '../../utils/helpers/elemRect'
import { em } from '../../utils/styleUtils'
import mixins from '../../styles/mixins'
import colors from '../../styles/colors'
import sizes from '../../styles/sizes'

const ToolTip = ({ children }) => {
  const [isShown, setIsShown] = useState(false)
  const { toolTipRef, popUpRef } = useContext(WorkPageContext)
  const { zoomedImg, canvasStateRefs } = useOutletContext()
  const { mousePositionRef } = canvasStateRefs
  const zoomedImgRef = useMemoRef(() => zoomedImg, [zoomedImg])

  const handleHover = ({ currentTarget }) => {
    toolTipRef.current = currentTarget
    setIsShown(true)
  }

  useEffect(() => {
    if (!isShown) return _.noop
    const mouseHandler = () => {
      if (!toolTipRef.current || !popUpRef.current) return
      const toolTip = new ElemRect(toolTipRef, sizes.toolTipPadding())
      const popUp = new ElemRect(popUpRef)

      const mousePosition = mousePositionRef.current
      if (
        toolTip.mouseIsOver(mousePosition) ||
        popUp.mouseIsOver(mousePosition) ||
        zoomedImgRef.current
      ) return

      const toolTipPoints = getToolTipPoints(toolTip, popUp)
      if (pointInPolygon(mousePositionRef.current, toolTipPoints))
        return

      setIsShown(false)
      toolTipRef.current = undefined
    }

    const removeMouseMove = addEventListener(document, 'mousemove', mouseHandler)
    const removeScroll = addEventListener(document, 'scroll', mouseHandler)
    return () => {
      removeMouseMove()
      removeScroll()
    }
  }, [isShown])

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
const ToolTipContainer = styled.div`
  position: absolute;
  left: calc(${sizes.mainContainerMargin} * -1 - ${toolTipSize} / 2);
  background-color: ${colors.toolTipBg};
  font-size: ${fontSizes.toolTip};

  ${mixins
    .chain()
    .squared(toolTipSize)
    .noSelect()
    .fontVar({ MONO: 1 })
    .flex('center', 'center')}

  border-radius: 1px;
  outline: ${sizes.toolTipBorder} currentColor solid;

  ${({ $isHighlighted }) => $isHighlighted ? `
    color:${colors.activeElem}; 
    outline: none;  
  ` : ''}
`

const PopUpContainer = styled.div`
  width: calc(${sizes.workDescriptionMaxWidth} * 0.85);
  padding: 0.8em;
  
  color: ${colors.toolTipColor};
  background-color: ${colors.toolTipBg};
  
  font-size: ${fontSizes.toolTipPopUp};
  font-weight: ${fontParams.semiLight};
  letter-spacing: -0.012em;
  word-spacing: -0.0225em;

  ${mixins.chain()
    .fixed(sizes.popUpPositions)
    .slant()
    .innerMargin(sizes.textInnerMargin)}

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