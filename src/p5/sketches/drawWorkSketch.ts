import { sketchSizes } from '../../styles/sizes'
import ElemRect from '../../utils/helpers/rect/elemRect'
import { styleDashedRect, wrapDrawingContext } from '../../utils/p5Utils'
import type p5 from 'p5'
import type { MutableRefObject } from 'react'

interface DrawWorkSketchProps {
  sidebarRef: MutableRefObject<HTMLAnchorElement | null>
  rosterRef: MutableRefObject<HTMLAnchorElement | null>
}

const drawWorkSketch = ({ sidebarRef, rosterRef }: DrawWorkSketchProps) => {
  let sidebar: ElemRect<HTMLAnchorElement> | undefined
  let roster: ElemRect<HTMLAnchorElement> | undefined

  const draw = (p5: p5) => {
    sidebar = ElemRect.createUpdated(
      sidebar,
      sidebarRef,
      sketchSizes.desktop.workIndex.listPadding.value
    )
    roster = ElemRect.createUpdated(
      roster,
      rosterRef,
      sketchSizes.desktop.workIndex.thumbnailPadding.value
    )
    wrapDrawingContext(p5, () => {
      if (!sidebar || !roster) return
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