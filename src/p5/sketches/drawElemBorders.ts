import { MutableRefObject } from 'react'
import p5 from 'p5'
import ElemRect from '../../utils/helpers/rect/elemRect'
import { styleDashedRect } from '../../utils/p5Utils'
import { validateRef } from '../../utils/typeUtils'

interface DrawElemBordersProps<T extends Element> {
  elemRefs: MutableRefObject<T | null>[]
}

const drawElemBorders = <T extends Element>({ elemRefs }: DrawElemBordersProps<T>) => {
  const draw = (p5: p5) => {
    styleDashedRect(p5)
    elemRefs.forEach(ref => {
      if (validateRef(ref))
        new ElemRect(ref).rectAround(p5)
    })
  }
  return { draw }
}

export default drawElemBorders