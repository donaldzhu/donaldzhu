import p5 from 'p5'
import { ToolTipProps } from '../../components/work/workTypes'
import { sketchSizes } from '../../styles/sizes'
import { getToolTipPoints } from '../../utils/commonUtils'
import ElemRect from '../../utils/helpers/rect/elemRect'
import { styleDashedRect, wrapDrawingContext } from '../../utils/p5Utils'
import { validateRef } from '../../utils/typeUtils'


const drawToolTip = ({ toolTipRef, popUpRef }: Required<ToolTipProps>) => {
  const draw = (p5: p5) => {
    if (!validateRef(toolTipRef) || !validateRef(popUpRef)) return
    const toolTip = new ElemRect(toolTipRef, sketchSizes.toolTip.padding.value)
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