import colors from '../styles/colors'
import { sketchSizes } from '../styles/sizes'
import { repeat } from './commonUtils'
import { getIsMobile } from './queryUtil'
import { Device } from './breakptTypes'
import type p5 from 'p5'
import type { coorTuple } from './utilTypes'


export enum P5Event {
  draw = 'draw',
  windowResized = 'windowResized',
  mouseClicked = 'mouseClicked',
  doubleClicked = 'doubleClicked',
  mouseMoved = 'mouseMoved',
  mousePressed = 'mousePressed',
  mouseWheel = 'mouseWheel',
  mouseDragged = 'mouseDragged',
  mouseReleased = 'mouseReleased',
  keyPressed = 'keyPressed',
  keyReleased = 'keyReleased',
  keyTyped = 'keyTyped',
  touchStarted = 'touchStarted',
  touchMoved = 'touchMoved',
  touchEnded = 'touchEnded',
  deviceMoved = 'deviceMoved',
  deviceTurned = 'deviceTurned',
  deviceShaken = 'deviceShaken',
}

export const parseVector = (vector: p5.Vector): [number, number] => [vector.x, vector.y]

export const styleDashedRect = (p5: p5) => {
  const device = getIsMobile() ? Device.Mobile : Device.Desktop
  p5.drawingContext.setLineDash(repeat(2, sketchSizes[device].line.dash.value))
  p5.noFill()
  p5.stroke(colors.dashLine)
  p5.strokeWeight(sketchSizes[device].line.weight.value)
}


export const intersectTwoCircles = (
  center1: p5.Vector,
  r1: number,
  center2: p5.Vector,
  r2: number
): [] | [coorTuple, coorTuple] => {
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

export const mousePosition = (p5: p5): [number, number] => [p5.mouseX, p5.mouseY]

export const wrapDrawingContext = (p5: p5 | p5.Graphics, callback: () => void) => {
  p5.push()
  callback()
  p5.pop()
}