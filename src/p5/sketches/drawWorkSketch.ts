import p5 from 'p5'
import { MutableRefObject } from 'react'
import { sketchSizes } from '../../styles/sizes'
import ElemRect from '../../utils/helpers/rect/elemRect'
import { styleDashedRect, wrapDrawingContext } from '../../utils/p5Utils'
import { validateRef } from '../../utils/typeUtils'

interface DrawWorkSketchProps {
  sidebarRef: MutableRefObject<HTMLAnchorElement | null>
  rosterRef: MutableRefObject<HTMLAnchorElement | null>
}

const drawWorkSketch = ({ sidebarRef, rosterRef }: DrawWorkSketchProps) => {
  const draw = (p5: p5) => {
    if (!validateRef(sidebarRef) || !validateRef(rosterRef)) return
    const sidebar = new ElemRect(sidebarRef, sketchSizes.workIndex.listPadding.value)
    const roster = new ElemRect(rosterRef, sketchSizes.workIndex.thumbnailPadding.value)

    wrapDrawingContext(p5, () => {
      sidebar.rectAround(p5)
      roster.rectAround(p5)
      styleDashedRect(p5)
      p5.line(...sidebar.topRight, ...roster.topLeft)
      p5.line(...sidebar.botRight, ...roster.botLeft)
    })
  }

  return { draw }
}

export default drawWorkSketch