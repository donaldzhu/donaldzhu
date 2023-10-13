import Size from '../../../utils/helpers/size'
import { Modes, XPositions, YPositions } from './constants'
import p5 from 'p5'

export enum VectorDrawMethods {
  DrawLinks = 'drawLinks',
  DrawPoints = 'drawPoints',
  DrawVolume = 'drawVolume'
}

export interface VectorSetting {
  x: number
  y: number
  scale: Size
  mode?: Modes
  position: [XPositions, YPositions]
  mouseOrigin: p5.Vector
  align: XPositions
  spaceDelimiter: string
  spaceWidth: number
  tracking: number
  leading: number
  drawingSequence: VectorDrawMethods[]
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
  easing: string
  squareMap: true
  getRanges: () => {
    x: [number, number]
    y: [number, number]
  },
  mapFunction: (stillVector: p5.Vector, mouseVector: p5.Vector) => {
    x: number,
    y: number
  }
}

export interface SetTransformProps {
  x?: number,
  y?: number,
  scale?: Size
}