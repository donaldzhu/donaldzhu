import type { Constraint, Engine } from 'matter-js'
import type Size from '../../../utils/helpers/size'
import type RollingFilter from '../../../utils/helpers/rollingFilter'
import type { Easing, Mode, VectorDrawMethod, XPosition, YPosition } from './constants'
import type p5 from 'p5'
import type { CoorObject } from '../../../utils/utilTypes'

export type VectorPosition = [XPosition, YPosition]

export interface VectorSetting {
  x: number
  y: number
  w?: Size
  scale: Size
  mode?: Mode
  position: VectorPosition
  mouseOrigin: p5.Vector
  align: XPosition
  isMobile: boolean
  spaceWidth: Size
  tracking: Size
  leading: Size
  drawingSequence: VectorDrawMethod[]
  maxStretch: number | CoorObject
  glyphWeight: Size
  glyphColor: number | string
  linkWeight: Size
  linkColor: number | string
  pointWeight: Size
  pointSize: Size
  pointFill: number | string
  pointColor: number | string
  volumeWeight: Size
  volumeColor: number | string
  correctVolumeStroke: boolean
  easing: Easing
  noMap: boolean,
  squareMap: boolean,
  mapFunction: (
    stillVector: p5.Vector,
    mouseVector: p5.Vector
  ) => CoorObject,
  mapMotionFunction: (
    rotationVector: p5.Vector,
    accelVector: p5.Vector,
    rollingAccelFilter: RollingFilter,
    bodies: {
      active: Matter.Body,
      constraint: Constraint
    },
    engine: Engine,
    minFrictionAir: number,
    debug?: {
      p5?: p5 | p5.Graphics,
      name?: string,
      enabled?: boolean,
    }
  ) => CoorObject
}

export interface SetTransformScaleProps {
  x?: number,
  y?: number,
  scale?: Size
}

interface SetTransformWidthProps {
  x?: number,
  y?: number,
  w: number,
  text: string
}

export type SetTransformProps = SetTransformScaleProps | SetTransformWidthProps

