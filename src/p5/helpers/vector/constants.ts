import * as easing from 'easing-utils'
import p5 from 'p5'
import _ from 'lodash'
import spacingsData from '../../../data/vector/spacings.json'
import { getBlankCoors, loopObject, map, typedKeys } from '../../../utils/commonUtils'
import Size from '../../../utils/helpers/size'
import { getVh, getVw } from '../../../utils/sizeUtils'
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
  getRanges: function () {
    return {
      x: [0, getVw()],
      y: [0, this.squareMap ? getVw() : getVh()],
    }
  },
  mapFunction: function (stillVector, directionVector) {
    const results = getBlankCoors(false)
    const distVector = directionVector.sub(('mouseOrigin' in this && this.mouseOrigin) ?
      this.mouseOrigin : stillVector)
    loopObject(Axes, axis => {
      const dist = distVector[axis]
      const [min, max] = this.getRanges()[axis]
      const eased = easing[this.easing](Math.abs(dist) / (max - min))
      results[axis] = stillVector[axis] +
        map(eased, 0, 1, 0, this.maxStretch * this.scale.value) * Math.sign(dist)
    })
    return results
  },

  maxAcceleration: 100000,
  mapMotionFunction: function (stillVector, velocity, rotationVector, lastTimeStamp, debug) {


    const result = {
      x: stillVector.x + map(Math.abs(rotationVector.x), 0, 180,
        0, this.maxStretch * this.scale.value * 3) * Math.sign(rotationVector.x),
      y: stillVector.y + map(Math.abs(rotationVector.y), 0, 180,
        0, this.maxStretch * this.scale.value * 3) * Math.sign(rotationVector.y),
    }
    if (debug.name === 'Z') {
      debug.p5.text(`${_.round(result.x, 3)} ${_.round(result.y, 3)}`, 10, 10)
      debug.p5.text(`${_.round(rotationVector.x, 3)} ${_.round(rotationVector.y, 3)}`, 10, 40)
    }
    return result
  }
}

