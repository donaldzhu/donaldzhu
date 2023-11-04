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
    rollingAccelFilter,
    bodies,
    engine,
    minFrictionAir,
    debug
  ) {
    const { x, y } = rotationVector
    const unmappedValues = {
      x,
      y: (90 - Math.abs(Math.abs((y % 180)) - 90)) *
        (y < 0 || y > 180 ? -1 : 1)
    }

    rollingAccelFilter.add(Math.max(Math.abs(accelVector.x), Math.abs(accelVector.y)))
    Object.assign(engine.gravity,
      mapObject(unmappedValues, (axis, unmapped) => {
        const unfiltered = unmapped / 90
        const eased = easing[this.easing](Math.abs(unfiltered))
        const acceleration = map(Math.abs(unmapped), 90, 0) * accelVector[axis]

        const accelFriction = map(
          Math.min(rollingAccelFilter.mean ?? 0, 10),
          0, 10, 0, 0.5
        )

        const dist = Math.hypot(
          bodies.constraint.pointA.x - bodies.active.position.x,
          bodies.constraint.pointA.y - bodies.active.position.y
        )
        // const positionFriction = map(
        //   bodies.constraint.length
        // )

        bodies.active.frictionAir = map(
          Math.min(rollingAccelFilter.mean ?? 0, 10),
          0, 10, 0, 0.5
        ) + minFrictionAir
        return acceleration * (axis === 'y' ? -1 : 1) * 0.675 +
          eased * Math.sign(unfiltered) * sketchSizes.mobile.main.physics.gravity.value
      }))

    // TODO: Remove
    if (debug?.enabled) {
      const { p5, enabled } = debug
      if (p5 && enabled)
        wrapDrawingContext(p5, () => {
          if (debug.name === 'W') {
            p5.text('x: ' + _.round(p5.dist(bodies.active.position.x, bodies.active.position.y, bodies.constraint.pointA.x, bodies.constraint.pointA.y), 3), 10, 20)
            // p5.text('x: ' + _.round(accelVector.x, 3), 10, 20)
            // p5.text('y: ' + _.round(accelVector.y, 3), 10, 30)
          }
        })
    }

    return bodies.active.position
  }
}

export const createMobilePhysicsSettings = () => ({
  active: {
    density: 5,
    frictionAir: _.random(0.01, 0.03, true),
    collisionFilter: { group: -1 }
  },
  constraint: {
    length: 0.01,
    damping: _.random(0.0125, 0.175, true),
    stiffness: _.random(0.01, 0.0125, true),
  }
})