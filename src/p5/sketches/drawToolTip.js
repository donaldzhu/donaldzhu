import { getToolTipPoints } from '../../utils/commonUtils'
import ElemRect from '../../utils/helpers/elemRect'
import { styleDashedRect, wrapDrawingContext } from '../../utils/p5Utils'
import sizes from '../../styles/sizes'

const drawToolTip = ({ toolTipRef, popUpRef }) => {
  const draw = p5 => {
    if (!toolTipRef.current || !popUpRef.current) return
    const toolTip = new ElemRect(toolTipRef, sizes.toolTipPadding())
    const popUp = new ElemRect(popUpRef)

    wrapDrawingContext(p5, () => {
      toolTip.rectAround(p5)
      popUp.rectAround(p5)

      const [toolTip1, popUp1, toolTip2, popUp2] = getToolTipPoints(toolTip, popUp)
      styleDashedRect(p5)
      p5.line(...toolTip1, ...popUp1)
      p5.line(...toolTip2, ...popUp2)
    })
  }

  return { draw }
}

export default drawToolTip