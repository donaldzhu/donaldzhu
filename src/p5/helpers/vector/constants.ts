import * as easing from 'easing-utils'
import p5 from 'p5'
import _ from 'lodash'
import spacingsData from '../../../data/vector/spacings.json'
import { getBlankCoors, loopObject, map, mapObject, typedKeys } from '../../../utils/commonUtils'
import Size from '../../../utils/helpers/size'
import { getVh, getVw } from '../../../utils/sizeUtils'
import { sketchSizes } from '../../../styles/sizes'
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

export const SPACE_DELIMITER = ' '

export const DEFAULT_SETTING: Omit<VectorSetting, 'mouseOrigin'> &
{ mouseOrigin?: p5.Vector } = {
  x: 0,
  y: 0,
  scale: new Size(1),
  position: [XPosition.Center, YPosition.Center],
  align: XPosition.Center,
  isMobile: false,
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

  mapMotionFunction: function (
    rotationVector,
    accelVector,
    bodies,
    engine,
    debug
  ) {
    const { x, y } = rotationVector
    const unmappedValues = {
      x,
      y: (90 - Math.abs(Math.abs((y % 180)) - 90)) *
        (y < 0 || y > 180 ? -1 : 1)
    }

    Object.assign(engine.gravity,
      mapObject(unmappedValues, (axis, unmapped) => {
        const unfiltered = map(unmapped, 0, 90)
        const eased = easing[this.easing](Math.abs(unfiltered))
        const acceleration = map(Math.abs(unmappedValues.x), 90, 0, 0, 1) * accelVector[axis]
        return acceleration * (axis === 'y' ? -1 : 1) +
          eased * Math.sign(unfiltered) * sketchSizes.mobile.physics.gravity.value
      }))

    // TODO: Remove
    if (debug?.enabled) {
      const { p5, enabled } = debug
      if (p5 && enabled)
        wrapDrawingContext(p5, () => {
          if (debug.name === 'W') {
            // console.log({
            //   x: _.round(accelVector.x, 3),
            //   y: _.round(accelVector.y, 3),
            //   z: _.round(accelVector.z, 3)
            // })
            p5.text('x: ' + _.round(accelVector.x, 3), 10, 20)
            p5.text('y: ' + _.round(accelVector.y, 3), 10, 30)
            p5.text('z: ' + _.round(accelVector.z, 3), 10, 40)
            p5.text('x: ' + _.round(rotationVector.x, 3), 10, 520)
            p5.text('y: ' + _.round(unmappedValues.y, 3), 10, 530)
            p5.text('z: ' + _.round(rotationVector.z, 3), 10, 540)

            // p5.text('gravity x: ' + _.round(engine.gravity.x, 3), 10, 40)
            // p5.text('gravity y: ' + _.round(engine.gravity.y, 3), 10, 50)
          }
        })
    }

    return bodies.active.position
  }
}


export const mobilePhysicsSettings = {
  active: {
    density: 5,
    frictionAir: 0.2,
    collisionFilter: { group: -1 }
  },
  constraint: {
    length: 0.01,
    damping: 0.1,
    stiffness: 0.011,
  }
}