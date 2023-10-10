import p5 from 'p5'
import { createStringEnum } from './helpers/enum'
import colors from '../styles/colors'
import { dashLineConfigs } from '../p5/configs/pageBorders'

export const P5_EVENTS = createStringEnum([
  'draw',
  'windowResized',
  'mouseClicked',
  'doubleClicked',
  'mouseMoved',
  'mousePressed',
  'mouseWheel',
  'mouseDragged',
  'mouseReleased',
  'keyPressed',
  'keyReleased',
  'keyTyped',
  'touchStarted',
  'touchMoved',
  'touchEnded',
  'deviceMoved',
  'deviceTurned',
  'deviceShaken',
])

export const parsePoints = (...vectors: p5.Vector[]) => vectors.reduce<number[]>((result, vector) => {
  result.push(vector.x, vector.y)
  return result
}, [])


export const styleDashedRect = (p5: p5) => {
  p5.drawingContext.setLineDash(dashLineConfigs.lineDash())
  p5.noFill()
  p5.stroke(colors.dashLine)
  // @ts-ignore
  p5.strokeWeight(dashLineConfigs.lineWeight())
}


export const intersectTwoCircles = (center1: p5.Vector, r1: number, center2: p5.Vector, r2: number) => {
  const { x: x1, y: y1 } = center1
  const { x: x2, y: y2 } = center2
  const R = center1.dist(center2)
  if (!(Math.abs(r1 - r2) <= R && R <= r1 + r2)) return []

  const R2 = R ** 2
  const R4 = R ** 4
  const a = (r1 ** 2 - r2 ** 2) / (2 * R2)
  const rSqrDiff = (r1 ** 2 - r2 ** 2)
  const c = Math.sqrt(
    2 * (r1 ** 2 + r2 ** 2) / R2 -
    (rSqrDiff ** 2) / R4 - 1
  )

  const fx = (x1 + x2) / 2 + a * (x2 - x1)
  const gx = c * (y2 - y1) / 2
  const ix1 = fx + gx
  const ix2 = fx - gx

  const fy = (y1 + y2) / 2 + a * (y2 - y1)
  const gy = c * (x1 - x2) / 2
  const iy1 = fy + gy
  const iy2 = fy - gy

  return [[ix1, iy1], [ix2, iy2]]
}

export const mousePosition = (p5: p5) => [p5.mouseX, p5.mouseY]

export const wrapDrawingContext = (p5: p5, callback: () => any) => {
  p5.push()
  callback()
  p5.pop()
}