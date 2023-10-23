import _ from 'lodash'
import { useEffect, useRef, useState } from 'react'
import { addEventListener } from '../utils/reactUtils'
import Gimbal from '../p5/helpers/gimbal'
import useMemoRef from './useMemoRef'

export interface MotionSettingInterface {
  isUsable: boolean | undefined
  needsPermission: boolean
}

type requestPermissionType = () => Promise<'granted' | 'denied'>
type Ios13MotionEvent = typeof DeviceMotionEvent & {
  requestPermission: requestPermissionType
}

const hasDeviceEvent = !!(DeviceOrientationEvent && DeviceMotionEvent)

const useMotion = () => {
  const getInitialState = (): MotionSettingInterface => {
    if (!hasDeviceEvent) return {
      isUsable: false,
      needsPermission: false
    }

    if (
      'requestPermission' in DeviceMotionEvent &&
      typeof DeviceMotionEvent.requestPermission === 'function' &&
      'requestPermission' in DeviceOrientationEvent &&
      typeof DeviceOrientationEvent.requestPermission === 'function') {
      return {
        isUsable: undefined,
        needsPermission: true
      }
    }
    return {
      isUsable: undefined,
      needsPermission: false
    }
  }

  const [motionSettings, setMotionSettings] =
    useState<MotionSettingInterface>(getInitialState())
  const motionSettingsRef = useMemoRef(() => motionSettings, [motionSettings])

  const gimbalRef = useRef<Gimbal | null>(null)
  const getPermission = !motionSettings.isUsable || !motionSettings.needsPermission ?
    () => {
      const promise = (DeviceMotionEvent as Ios13MotionEvent).requestPermission()
      promise.then(value => {
        setMotionSettings({
          isUsable: value === 'granted',
          needsPermission: false
        })
      })
      return promise
    } : null

  useEffect(() => {
    const setUsable = _.once(() => setMotionSettings(prev => ({
      ...prev,
      isUsable: true
    })))

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
    motionSettingsRef,
    gimbalRef,
    getPermission
  }
}

export default useMotion