import ElemRect from '../../utils/helpers/rect/elemRect'
import { styleDashedRect } from '../../utils/p5Utils'
import { validateRef } from '../../utils/typeUtils'
import type p5 from 'p5'
import type { MutableRefObject } from 'react'
import type Size from '../../utils/helpers/size'

interface DrawElemBordersProps<T extends Element> {
  elemRefs: MutableRefObject<T | null>[]
  padding?: Size
}

const drawElemBorders = <T extends Element>({ elemRefs, padding }: DrawElemBordersProps<T>) => {
  const draw = (p5: p5) => {
    styleDashedRect(p5)
    elemRefs.forEach(ref => {
      if (validateRef(ref))
        new ElemRect(ref, padding?.value).rectAround(p5)
    })
  }
  return { draw }
}

export default drawElemBorders