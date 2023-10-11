import { useState, useEffect } from 'react'
import _ from 'lodash'
import { addEventListener } from '../utils/reactUtils'

const useCanAutoPlay = () => {
  const activationEvents: (keyof DocumentEventMap)[] = ['keydown', 'mousedown', 'pointerdown', 'pointerup', 'touchend']
  const [canAutoPlay, setCanAutoPlay] = useState<boolean | undefined>()

  useEffect(() => {
    const video = document.createElement('video')
    video.src = '/assets/test.webm'
    video.muted = true
    video.play()
      .then(() => setCanAutoPlay(true))
      .catch(() => setCanAutoPlay(false))
  }, [])

  useEffect(() => {
    if (canAutoPlay) return _.noop
    const listenerRemovers = activationEvents.map(eventName =>
      addEventListener(document, eventName, () => setCanAutoPlay(true))
    )
    return () => listenerRemovers.forEach(remover => remover())
  }, [canAutoPlay])

  return canAutoPlay
}

export default useCanAutoPlay