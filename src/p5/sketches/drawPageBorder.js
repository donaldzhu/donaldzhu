import ElemRect from '../../utils/helpers/elemRect'
import colors from '../../styles/colors'
import sizes from '../../styles/sizes'
import { dashLineConfigs } from '../configs/pageBorders'

const drawPageBorders = ({ headerRef, footerRef, sidebarRef }) => {
  const drawBorder = (p5, ref, section) => {
    let { topLeft, topRight, botLeft, botRight, x2, y1, y2 } = new ElemRect(ref)

    if (section === 'sidebar') {
      p5.line(...topLeft, ...topRight)
      p5.line(...botLeft, ...botRight)
    }

    const vertGap = sizes.vertBorderGap()
    y1 += section === 'sidebar' || section === 'footer' ? vertGap : 0
    y2 -= section === 'sidebar' || section === 'header' ? vertGap : 0
    p5.line(x2, y1, x2, y2)
  }

  const draw = p5 => {
    if (
      !headerRef.current ||
      !footerRef.current ||
      !sidebarRef.current
    ) return

    p5.noFill()
    p5.stroke(colors.border)
    p5.strokeWeight(dashLineConfigs.lineWeight())
    drawBorder(p5, headerRef, 'header')
    drawBorder(p5, footerRef, 'footer')
    drawBorder(p5, sidebarRef, 'sidebar')
  }

  return { draw }
}

export default drawPageBorders