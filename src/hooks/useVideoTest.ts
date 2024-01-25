import { useEffect, useState } from 'react'
import { addEventListener } from '../utils/reactUtils'

const useVideoTest = () => {
  const activationEvents: (keyof DocumentEventMap)[] =
    ['mousedown', 'pointerdown', 'pointerup', 'touchend']
  const [canAutoPlay, setCanAutoPlay] = useState<boolean | undefined>()
  const [defaultCanAutoPlay, setInitialCanAutoPlay] = useState<boolean | undefined>()

  const video = document.createElement('video')
  const canPlayWebm = video.canPlayType('video/webm; codecs="vp8, vorbis"') === 'probably'

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
    if (canAutoPlay) return
    const listenerRemovers = activationEvents.map(eventName =>
      addEventListener(document, eventName, () => setCanAutoPlay(true))
    )

    const removeKeyboardListener = addEventListener(document, 'keydown', e => {
      if (e.key !== 'Escape') setCanAutoPlay(true)
    })

    return () => {
      listenerRemovers.forEach(remover => remover())
      removeKeyboardListener()
    }
  }, [canAutoPlay])

  return { canAutoPlay, defaultCanAutoPlay, canPlayWebm }
}

export default useVideoTest