import p5 from 'p5'
import Size from '../../../utils/helpers/size'
import { CanvasState } from '../../../components/canvas/canvasTypes'
import { CoorObject } from '../../../utils/utilTypes'
import { Mode, XPosition, YPosition } from './constants'

export enum VectorDrawMethod {
  DrawLinks = 'drawLinks',
  DrawPoints = 'drawPoints',
  DrawVolume = 'drawVolume'
}

export type VectorPosition = [XPosition, YPosition]

export interface VectorSetting {
  x: number
  y: number
  scale: Size
  mode?: Mode
  position: VectorPosition
  mouseOrigin: p5.Vector
  align: XPosition
  isMobile: boolean
  spaceDelimiter: string
  spaceWidth: Size
  tracking: Size
  leading: Size
  drawingSequence: VectorDrawMethod[]
  maxStretch: number
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
  squareMap: true
  getRanges: () => {
    x: [number, number]
    y: [number, number]
  },
  mapFunction: (stillVector: p5.Vector, directionVector: p5.Vector) => CoorObject,

  maxAcceleration: number,
  mapMotionFunction: (
    activeVector: p5.Vector,
    velocity: p5.Vector,
    rotationVector: p5.Vector,
    lastTimeStamp: number,
    debug?: any
  ) => CoorObject
}

export interface SetTransformScaleProps {
  x?: number,
  y?: number,
  scale?: Size
}

export interface SetTransformWidthProps {
  x?: number,
  y?: number,
  w: number,
  text: string
}

export type SetTransformProps = SetTransformScaleProps | SetTransformWidthProps


export const enum Easing {
  Linear = 'linear',
  EaseInSine = 'easeInSine',
  EaseOutSine = 'easeOutSine',
  EaseInOutSine = 'easeInOutSine',
  EaseInQuad = 'easeInQuad',
  EaseOutQuad = 'easeOutQuad',
  EaseInOutQuad = 'easeInOutQuad',
  EaseInCubic = 'easeInCubic',
  EaseOutCubic = 'easeOutCubic',
  EaseInOutCubic = 'easeInOutCubic',
  EaseInQuart = 'easeInQuart',
  EaseOutQuart = 'easeOutQuart',
  EaseInOutQuart = 'easeInOutQuart',
  EaseInQuint = 'easeInQuint',
  EaseOutQuint = 'easeOutQuint',
  EaseInOutQuint = 'easeInOutQuint',
  EaseInExpo = 'easeInExpo',
  EaseOutExpo = 'easeOutExpo',
  EaseInOutExpo = 'easeInOutExpo',
  EaseInCirc = 'easeInCirc',
  EaseOutCirc = 'easeOutCirc',
  EaseInOutCirc = 'easeInOutCirc',
  EaseInBack = 'easeInBack',
  EaseOutBack = 'easeOutBack',
  EaseInOutBack = 'easeInOutBack',
  EaseInElastic = 'easeInElastic',
  EaseOutElastic = 'easeOutElastic',
  EaseInOutElastic = 'easeInOutElastic',
  EaseOutBounce = 'easeOutBounce',
  EaseInBounce = 'easeInBounce',
  EaseInOutBounce = 'easeInOutBounce',
}

export type MotionSettings = Pick<CanvasState, 'motionSettingsRef' | 'motionRef'>