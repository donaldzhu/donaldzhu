import p5 from 'p5'
import { MutableRefObject } from 'react'
import { Engine } from 'matter-js'
import useGlobalCanvas from '../../hooks/useGlobalCanvas'
import { P5Event } from '../../utils/p5Utils'
import { MotionSettingInterface } from '../../hooks/useMotion'
import Gimbal from '../../utils/helpers/motion/gimbal'
import { Device } from '../../utils/queryUtil'

export type DesktopCanvasStates = Partial<{
  mousePositionRef: MutableRefObject<null | [number, number]>
  hideCursorRef: MutableRefObject<boolean>
}>

export type MobileCanvasStates = Partial<{
  motionSettings: MotionSettingInterface,
  motionSettingsRef: MutableRefObject<MotionSettingInterface | undefined>
  isGyroEnabled: boolean,
  isGyroEnabledRef: MutableRefObject<boolean | undefined>,
  gimbalRef: MutableRefObject<Gimbal | null>
  engine: Engine
}>

export type CanvasStates = DesktopCanvasStates | MobileCanvasStates
export type TypedCanvasStates<T extends Device> = T extends Device.desktop ?
  DesktopCanvasStates :
  MobileCanvasStates

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


export type CanvasRefType = ReturnType<typeof useGlobalCanvas>

export interface GlobalCanvasStates<T extends Device> {
  canvasRef: CanvasRefType
  canvasStates: TypedCanvasStates<T>
}
