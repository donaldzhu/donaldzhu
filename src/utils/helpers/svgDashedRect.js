import _ from 'lodash'
import ElemRect from './elemRect'
import { repeatMap, keysToObject } from '../commonUtils.ts'
import colorConfig from '../../styles/colors'
import { dashLineConfigs } from '../../p5/configs/pageBorders'

class SvgDashedRect extends ElemRect {
  constructor(ref, padding = 0, stroke = 5) {
    padding -= stroke / 2

    super(ref, padding, true)
    this.stroke = stroke
    this.dashLength = dashLineConfigs.lineDash()[0]
    const halfDash = this.dashLength / 2
    this.innerRect = new ElemRect(ref, padding - halfDash, true)

    const dashLengths = repeatMap(2, i => this.getAdjustedDashLength(
      !i ? this.innerRect.w : this.innerRect.h))

    this.lineInnerRect = new ElemRect(ref, dashLengths.map(dashLength => padding - halfDash - dashLength), true)

    this.polyLineStyle = {
      fill: 'none',
      stroke: colorConfig.dashLine,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      strokeWidth: stroke
    }
    this.lineStyles = dashLengths.map(dashLength => ({
      ...this.polyLineStyle, strokeDasharray: Array(2).fill(dashLength)
    }))
  }

  getAdjustedDashLength(size) {
    let segmentCount = Math.trunc(size / this.dashLength)
    segmentCount += (segmentCount + 1) % 2 // 0 if odd, 1 if even
    return _.round(size / segmentCount, 3)
  }

  get lines() {
    const keys = ['x1', 'y1', 'x2', 'y2']
    const { lineInnerRect } = this
    return repeatMap(4, i => {
      const xCoor = i % 2 ? this.x1 : this.x2
      const yCoor = i % 2 ? this.y1 : this.y2
      const horLine = [lineInnerRect.x1, yCoor, lineInnerRect.x2, yCoor]
      const vertLine = [xCoor, lineInnerRect.y1, xCoor, lineInnerRect.y2]
      return !Math.floor(i / 2) ? horLine : vertLine
    }).map(points => keysToObject(keys, (_, __, i) => points[i]))
  }

  get polylines() {
    const { innerRect } = this
    return [
      [this.x2, innerRect.y2, ...this.botRight, innerRect.x2, this.y2],
      [innerRect.x1, this.y2, ...this.botLeft, this.x1, innerRect.y2],
      [this.x1, innerRect.y1, ...this.topLeft, innerRect.x1, this.y1],
      [innerRect.x2, this.y1, ...this.topRight, this.x2, innerRect.y1]
    ].map(line => line.join(' '))
  }

  get paddedW() {
    return this.w + this.stroke
  }

  get paddedH() {
    return this.h + this.stroke
  }
}

export default SvgDashedRect