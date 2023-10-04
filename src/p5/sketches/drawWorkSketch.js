import ElemRect from '../../utils/helpers/elemRect'
import { styleDashedRect, wrapDrawingContext } from '../../utils/p5Utils'
import sizes from '../../styles/sizes'


const drawWorkSketch = ({ sidebarRef, rosterRef }) => {
  const draw = p5 => {
    if (!sidebarRef.current || !rosterRef.current) return
    const sidebar = new ElemRect(sidebarRef, sizes.workIndexRectPadding())
    const roster = new ElemRect(rosterRef, sizes.workThumbnailRectPadding())

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