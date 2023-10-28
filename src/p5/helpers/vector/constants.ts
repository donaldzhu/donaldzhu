import * as easing from 'easing-utils'
import p5 from 'p5'
import _ from 'lodash'
import spacingsData from '../../../data/vector/spacings.json'
import { getBlankCoors, loopObject, map, mapObject, typedKeys } from '../../../utils/commonUtils'
import Size from '../../../utils/helpers/size'
import { getVh, getVw } from '../../../utils/sizeUtils'
import { wrapDrawingContext } from '../../../utils/p5Utils'
import { Easing, VectorSetting } from './vectorTypes'


export const enum Mode {
  Center,
  Corner
}

enum Axes {
  x = 'x',
  y = 'y'
}

export const X_HEIGHT = 44
export const GLYPH_NAMES = typedKeys(spacingsData).filter(char => char.length === 1)

export const enum XPosition {
  Left,
  Center,
  Right
}

export const enum YPosition {
  Top,
  Center,
  Bottom
}

export const DEFAULT_SETTING: Omit<VectorSetting, 'mouseOrigin'> &
{ mouseOrigin?: p5.Vector } = {
  x: 0,
  y: 0,
  scale: new Size(1),
  position: [XPosition.Center, YPosition.Center],
  align: XPosition.Center,
  isMobile: false,
  spaceDelimiter: ' ',
  spaceWidth: new Size(25),
  tracking: new Size(3),
  leading: new Size(85),
  drawingSequence: [],
  maxStretch: 4,
  glyphWeight: new Size(1),
  glyphColor: 0,
  linkWeight: new Size(1),
  linkColor: 0,
  pointWeight: new Size(1),
  pointSize: new Size(5),
  pointFill: 0,
  pointColor: 0,
  volumeWeight: new Size(1),
  volumeColor: 0,
  correctVolumeStroke: false,
  easing: Easing.Linear,
  squareMap: true,
  mapFunction: function (stillVector, mouseVector) {
    const results = getBlankCoors(false)
    const distVector = mouseVector.sub(('mouseOrigin' in this && this.mouseOrigin) ?
      this.mouseOrigin : stillVector)
    const ranges = {
      x: [0, getVw()],
      y: [0, this.squareMap ? getVw() : getVh()],
    }

    loopObject(Axes, axis => {
      const dist = distVector[axis]
      const [min, max] = ranges[axis]
      const eased = easing[this.easing](Math.abs(dist) / (max - min))
      const maxStretch = typeof this.maxStretch === 'object' ? this.maxStretch[axis] : this.maxStretch
      results[axis] = stillVector[axis] +
        map(eased, 0, 1, 0, maxStretch * this.scale.value) * Math.sign(dist)
    })
    return results
  },

  mapMotionFunction: function (stillVector, rotationVector, bodies, debug) {
    const maxStretch = typeof this.maxStretch === 'object' ?
      this.maxStretch : {
        x: this.maxStretch,
        y: this.maxStretch
      }

    const { x, y } = rotationVector
    const unmappedValues = {
      x,
      y: 90 - Math.abs(Math.abs((y % 180)) - 90)
    }
    const result = mapObject(unmappedValues, (axis, unmapped) => {
      const unfiltered = map(unmapped, 0, 90)
      const eased = easing[this.easing](Math.abs(unfiltered))
      const sign = Math.sign(unfiltered) * (axis === 'y' ? (y < 0 || y > 180 ? -1 : 1) : 1)
      const multiplier = maxStretch[axis] * this.scale.value
      return stillVector[axis] + eased * sign * multiplier
    })

    // TODO: Remove
    if (debug && debug.enabled) {
      const { p5, enabled } = debug
      if (p5 && enabled)
        wrapDrawingContext(p5, () => {
          if (debug.name === 'Z') {
            const coors = [x, y].map(coor => _.round(coor, 1))
            p5.text('x: ' + coors[0], 10, 20)
            p5.text('y: ' + coors[1], 10, 30)
          }
          p5.stroke(0, 255, 0)
          p5.fill(0)
          p5.ellipse(bodies.constraint.pointA.x, bodies.constraint.pointA.y, 10)
          p5.fill(255, 0, 0)
          p5.ellipse(bodies.active.position.x, bodies.active.position.y, 10)
        })
    }
    return result
  }
}


export const mobilePhysicsSettings = {
  active: {
    density: 0.1,
    frictionAir: 0.02,
    collisionFilter: { group: -1 }
  },
  constraint: {
    length: 50,
    //damping: 0.1,
    stiffness: 0.1,
  }
}