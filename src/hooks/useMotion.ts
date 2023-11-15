import _ from 'lodash'
import { useEffect, useRef, useState } from 'react'
import { addEventListener } from '../utils/reactUtils'
import Gimbal from '../utils/helpers/motion/gimbal'

export interface MotionSettingInterface {
  hasMotion: boolean,
  isUsable: boolean | undefined
}

const DeviceMotionEvent = window.DeviceMotionEvent
const DeviceOrientationEvent = window.DeviceOrientationEvent

type requestPermissionType = () => Promise<'granted' | 'denied'>
type Ios13MotionEvent = typeof DeviceMotionEvent & {
  requestPermission: requestPermissionType
}


const needsPermission =
  DeviceMotionEvent &&
  DeviceOrientationEvent &&
  'requestPermission' in DeviceMotionEvent &&
  typeof DeviceMotionEvent.requestPermission === 'function' &&
  'requestPermission' in DeviceOrientationEvent &&
  typeof DeviceOrientationEvent.requestPermission === 'function'

const useMotion = () => {
  const getInitialState = (): MotionSettingInterface =>
    (!('DeviceOrientationEvent' in window && 'DeviceMotionEvent' in window)) ? {
      hasMotion: false,
      isUsable: false,
    } : needsPermission ? {
      hasMotion: true,
      isUsable: undefined,
    } : {
      hasMotion: true,
      isUsable: true,
    }

  const [motionSettings, setMotionSettings] =
    useState<MotionSettingInterface>(getInitialState())

  const gimbalRef = useRef<Gimbal | null>(null)

  const getPermission =
    !motionSettings.hasMotion || motionSettings.isUsable === false ? null :
      motionSettings.isUsable ? () => 'granted' : () => {
        const promise = (DeviceMotionEvent as Ios13MotionEvent).requestPermission()
        promise.then(value => {
          setMotionSettings({
            hasMotion: true,
            isUsable: value === 'granted',
          })
        })
        return promise
      }

  useEffect(() => {
    const setUsable = _.once(() => setMotionSettings({
      hasMotion: true,
      isUsable: true
    }))

    const gimbal = gimbalRef.current = new Gimbal()

    return addEventListener(
      window, 'deviceorientation',
      e => {
        gimbal.onSensorMove(e)
        setUsable()
      }, false)
  }, [])

  return {
    motionSettings,
    gimbalRef,
    getPermission
  }
}

export default useMotion