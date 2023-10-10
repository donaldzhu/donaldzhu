import ElemRect from '../../utils/helpers/rect/elemRect'
import { styleDashedRect } from '../../utils/p5Utils'

const drawElemBorders = ({ elemRefs }) => {
  const draw = p5 => {
    styleDashedRect(p5)
    elemRefs.forEach(ref => {
      if (ref.current)
        new ElemRect(ref).rectAround(p5)
    })
  }
  return { draw }
}

export default drawElemBorders