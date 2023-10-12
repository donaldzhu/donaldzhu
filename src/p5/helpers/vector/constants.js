import * as easing from 'easing-utils'
import { getVh, getVw, map, typedKeys } from '../../../utils/commonUtils.ts'
import { Enum, createStringEnum } from '../../../utils/helpers/enum.ts'
import spacingsData from '../../../data/vector/spacings'

export const MODES = createStringEnum(['CENTER', 'CORNER'])
export const AXES = ['x', 'y']
export const X_HEIGHT = 44
export const GLYPH_NAMES = typedKeys(spacingsData).filter(char => char.length === 1)

export const X_POSITIONS = new Enum(['LEFT', 'CENTER', 'RIGHT'])
export const Y_POSITIONS = new Enum(['TOP', 'CENTER', 'BOTTOM'])


export const DEFAULT_SETTING = {
  x: 0,
  y: 0,
  scale: () => 1,
  position: [MODES.CENTER, MODES.CENTER],
  align: MODES.CENTER,
  spaceDelimiter: ' ',
  spaceWidth: 25,
  tracking: 3,
  leading: 85,
  drawingSequence: [],
  maxStretch: 4,
  glyphWeight: 1,
  glyphColor: 0,
  linkWeight: 1,
  linkColor: 0,
  pointWeight: 1,
  pointSize: 5,
  pointFill: 0,
  pointColor: 0,
  volumeWeight: 1,
  volumeColor: 0,
  correctVolumeStroke: false,
  easing: 'linear',
  squareMap: true,
  highlightedWords: [],
  getRanges: function () {
    return {
      x: [0, getVw()],
      y: [0, this.squareMap ? getVw() : getVh()],
    }
  },
  mapFunction: function (stillVector, mouseVector) {
    const results = { x: 0, y: 0 }
    const distVector = mouseVector.sub(this.mouseOrigin)
    for (let i = 0; i < AXES.length; i++) {
      const axis = AXES[i]
      const dist = distVector[axis]
      const [min, max] = this.getRanges()[axis]
      const eased = easing[this.easing](Math.abs(dist) / (max - min))
      results[axis] = stillVector[axis] + map(eased, 0, 1, 0, this.maxStretch * this.scale) * Math.sign(dist)
    }
    return results
  }
}

