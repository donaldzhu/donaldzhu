import _ from 'lodash'
import { useEffect, useRef, useState } from 'react'
import { addEventListener } from '../utils/reactUtils'
import { getBlankCoors } from '../utils/commonUtils'
import { rotateX, rotateY, multiply, transform } from '../utils/helpers/deviceMotion'
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

  const motionRef = useRef(getBlankCoors(true))
  const rotationRef = useRef(getBlankCoors(true))
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
    const radianRatio = Math.PI / 180
    const setUsable = _.once(() => setMotionSettings(prev => ({
      ...prev,
      isUsable: true
    })))

    const removeOrientationListener = addEventListener(window, 'deviceorientation',
      ({ beta, gamma, alpha }) => {
        const rotationData = rotationRef.current
        rotationData.x = beta ?? 0 * radianRatio
        rotationData.y = gamma ?? 0 * radianRatio
        rotationData.z = alpha ?? 0 * radianRatio
        setUsable()
      }
    )

    const removeMotionListener = addEventListener(window, 'devicemotion', e => {
      const rotationData = rotationRef.current
      const deviceMotion = motionRef.current
      if (e.acceleration) {
        // TODO test assignWith
        deviceMotion.x = rotationData.x * 2
        deviceMotion.y = rotationData.y * 2
        deviceMotion.z = rotationData.z * 2
        return
      }

      const grav = transform(multiply(
        rotateY(rotationData.y * radianRatio),
        rotateX(rotationData.x * radianRatio)
      ), [0, 0, -9.80665])

      const { x, y, z } = e.accelerationIncludingGravity ?? {}
      deviceMotion.x = (x ?? 0 + grav[0]) * 2
      deviceMotion.y = (y ?? 0 + grav[1]) * 2
      deviceMotion.z = (z ?? 0 - grav[2]) * 2
    })

    return () => {
      removeOrientationListener()
      removeMotionListener()
    }
  }, [])

  return {
    motionSettings,
    motionSettingsRef,
    motionRef,
    getPermission
  }
}

export default useMotion