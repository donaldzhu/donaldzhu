import _ from 'lodash'
import { useEffect, useState } from 'react'
import dashjs from 'dashjs'
import { addEventListener } from '../utils/reactUtils'

const useVideoTest = () => {
  const activationEvents: (keyof DocumentEventMap)[] =
    ['keydown', 'mousedown', 'pointerdown', 'pointerup', 'touchend']
  const [canAutoPlay, setCanAutoPlay] = useState<boolean | undefined>()
  const [defaultCanAutoPlay, setInitialCanAutoPlay] = useState<boolean | undefined>()

  const video = document.createElement('video')
  const canPlayWebm = video.canPlayType('video/webm; codecs="vp8, vorbis"') === 'probably'
  const canUseDash = dashjs.supportsMediaSource()

  useEffect(() => {
    const video = document.createElement('video')
    video.src = 'assets-local/autoplay-test/test.mp4'
    video.muted = true
    video.playsInline = true
    video.play()
      .then(() => setCanAutoPlay(true))
      .catch(() => setCanAutoPlay(false))
  }, [])

  useEffect(() => {
    if (defaultCanAutoPlay !== false)
      setInitialCanAutoPlay(canAutoPlay)
    if (canAutoPlay) return _.noop
    const listenerRemovers = activationEvents.map(eventName =>
      addEventListener(document, eventName, () => setCanAutoPlay(true))
    )
    return () => listenerRemovers.forEach(remover => remover())
  }, [canAutoPlay])

  return { canAutoPlay, defaultCanAutoPlay, canPlayWebm, canUseDash }
}

export default useVideoTest