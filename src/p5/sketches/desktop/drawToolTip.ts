import { sketchSizes } from '../../../styles/sizes'
import { getToolTipPoints } from '../../../utils/commonUtils'
import ElemRect from '../../../utils/helpers/rect/elemRect'
import { styleDashedRect, wrapDrawingContext } from '../../../utils/p5Utils'
import type p5 from 'p5'
import type { ToolTipProps } from '../../../components/desktop/work/workTypes'


const drawToolTip = ({ toolTipRef, popUpRef }: Required<ToolTipProps>) => {
  let toolTip: ElemRect<HTMLDivElement> | undefined
  let popUp: ElemRect<HTMLDivElement> | undefined

  const draw = (p5: p5) => {
    toolTip = ElemRect.createUpdated(toolTip, toolTipRef, sketchSizes.desktop.toolTip.padding.value)
    popUp = ElemRect.createUpdated(popUp, popUpRef)
    wrapDrawingContext(p5, () => {
      if (!toolTip || !popUp) return
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