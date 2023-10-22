import * as easing from 'easing-utils'
import p5 from 'p5'
import _ from 'lodash'
import spacingsData from '../../../data/vector/spacings.json'
import { getBlankCoors, lerp, loopObject, map, mapObject, typedKeys } from '../../../utils/commonUtils'
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

  mapMotionFunction: function (stillVector, activeVector, rotationData, debug) {
    const rotationVector = rotationData.vector
    const { x, y } = rotationVector
    const maxStretch = typeof this.maxStretch === 'object' ?
      this.maxStretch :
      {
        x: this.maxStretch,
        y: this.maxStretch
      }

    let result = {
      x: map(
        Math.abs(x),
        0, 180,
        0, maxStretch.x * this.scale.value
      ) * rotationData.sign,
      y: map(
        Math.abs(Math.abs(y) - 180),
        180, 0,
        0, maxStretch.y * this.scale.value
      ),
    }

    result = mapObject(result, (axis, uneasedValue) => {
      const easedValue = stillVector[axis] + easing[this.easing](
        Math.abs(uneasedValue) / 180) * Math.sign(uneasedValue * rotationVector[axis]) * 180
      return lerp(activeVector[axis], easedValue, 0.7)
    })

    if (debug.name === 'Z') {
      const { p5 } = debug
      p5.text(`${_.round(result.x, 0)} ${_.round(result.y, 0)}`, 10, 10)
      p5.text(`${_.round(rotationVector.x, 0)} ${_.round(rotationVector.y, 0)} ${_.round(rotationVector.z, 0)}`, 10, 20)
    }
    return result
  }
}

