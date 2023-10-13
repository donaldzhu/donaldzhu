import * as easing from 'easing-utils'
import { map } from '../../../utils/commonUtils'
import spacingsData from '../../../data/vector/spacings.json'
import { VectorSetting } from './vectorTypes'
import p5 from 'p5'
import { getVh, getVw } from '../../../utils/sizeUtils'
import Size from '../../../utils/helpers/size'

export const enum Mode {
  Center,
  Corner
}

export const AXES = ['x', 'y']
export const X_HEIGHT = 44
export const GLYPH_NAMES = Object.keys(spacingsData).filter(char => char.length === 1)

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
  spaceDelimiter: ' ',
  spaceWidth: 25,
  tracking: 3,
  leading: 85,
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
  easing: 'linear',
  squareMap: true,
  getRanges: function () {
    return {
      x: [0, getVw()],
      y: [0, this.squareMap ? getVw() : getVh()],
    }
  },
  mapFunction: function (stillVector, mouseVector) {
    const results = { x: 0, y: 0 }
    const distVector = mouseVector.sub(('mouseOrigin' in this && this.mouseOrigin) ?
      this.mouseOrigin : stillVector)
    for (let i = 0; i < AXES.length; i++) {
      const axis = AXES[i]
      const dist = distVector[axis]
      const [min, max] = this.getRanges()[axis]
      const eased = easing[this.easing](Math.abs(dist) / (max - min))
      results[axis] = stillVector[axis] +
        map(eased, 0, 1, 0, this.maxStretch * this.scale.value) * Math.sign(dist)
    }
    return results
  }
}

