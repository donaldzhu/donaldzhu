import p5 from 'p5'
import { MutableRefObject } from 'react'
import { Engine } from 'matter-js'
import useGlobalCanvas from '../../hooks/useGlobalCanvas'
import { P5Event } from '../../utils/p5Utils'
import { MotionSettingInterface } from '../../hooks/useMotion'
import Gimbal from '../../utils/helpers/motion/gimbal'
import { Device } from '../../utils/queryUtil'

export interface DesktopCanvasStates {
  mousePositionRef: MutableRefObject<null | [number, number]>
  hideCursorRef: MutableRefObject<boolean>
}

// Needed for engine-only initiation
interface PartialMobileCanvasStates {
  engine: Engine
}

interface GyroStateInterface {
  hasRequested: boolean,
  isEnabled: boolean
}

export interface MobileCanvasStates {
  motionSettings: MotionSettingInterface,
  motionSettingsRef: MutableRefObject<MotionSettingInterface | undefined>
  gyroStates: GyroStateInterface,
  gyroStatesRef: MutableRefObject<GyroStateInterface | undefined>,
  gimbalRef: MutableRefObject<Gimbal | null>
  engine: Engine
}

type TypedCanvasStates<T extends Device> = T extends Device.desktop ?
  DesktopCanvasStates : MobileCanvasStates
type PartialTypedCanvasStates<T extends Device> = T extends Device.desktop ?
  DesktopCanvasStates : PartialMobileCanvasStates


export type CanvasRefType = ReturnType<typeof useGlobalCanvas>

export interface GlobalCanvasStates<T extends Device> {
  canvasRef: CanvasRefType
  canvasStates: TypedCanvasStates<T>
}
export interface PartialGlobalCanvasStates<T extends Device> {
  canvasRef: CanvasRefType
  canvasStates: PartialTypedCanvasStates<T>
}

export type p5Callback = (p5: p5) => void
export type p5EventCallback = (p5: p5, evt?: Event | UIEvent) => void
export type P5EventHandlers = Record<P5Event, p5EventCallback>

export type sketchEventCallback<T extends Device> = (
  p5: p5,
  canvasStates: TypedCanvasStates<T>
) => void
export type SketchEventHandler<T extends Device> =
  Record<P5Event | 'setup', sketchEventCallback<T>> & {
    cleanup: (canvasStates: TypedCanvasStates<T>) => void
  }

