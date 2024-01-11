import ElemRect from '../../../utils/helpers/rect/elemRect'
import { styleDashedRect } from '../../../utils/p5Utils'
import { validateRef } from '../../../utils/typeUtils'
import type p5 from 'p5'
import type { MutableRefObject } from 'react'
import type Size from '../../../utils/helpers/size'
import type { MobileContextProps } from '../../../components/mobile/pageWrappers/pageTypes'

interface DrawElemBordersProps<T extends Element> {
  elemRefs: MutableRefObject<T | null>[]
  padding?: Size,
  headerRef?: MobileContextProps['headerRef']
}

const drawElemBorders = <T extends Element>({
  elemRefs,
  padding,
  headerRef
}: DrawElemBordersProps<T>) => {
  let header: ElemRect<HTMLHeadElement>

  const draw = (p5: p5) => {
    styleDashedRect(p5)
    elemRefs.forEach(ref => {
      if (validateRef(ref))
        new ElemRect(ref, padding?.value).rectAround(p5)
    })

    if (headerRef) {
      header ??= new ElemRect(headerRef)
      p5.fill(255)
      p5.noStroke()
      p5.rect(header.x, header.y, header.w, header.h)
    }
  }
  return { draw }
}

export default drawElemBorders