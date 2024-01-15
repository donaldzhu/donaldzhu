import _ from 'lodash'
import { useEffect, useState } from 'react'
import { addEventListener } from '../utils/reactUtils'
import { VidExt } from '../utils/helpers/preloader/preloadUtils'
import useIsMobile from './useIsMobile'

const useCanAutoPlay = () => {
  const activationEvents: (keyof DocumentEventMap)[] =
    ['keydown', 'mousedown', 'pointerdown', 'pointerup', 'touchend']
  const [canAutoPlay, setCanAutoPlay] = useState<boolean | undefined>()
  const [defaultCanAutoPlay, setInitialCanAutoPlay] = useState<boolean | undefined>()
  const isMobile = useIsMobile()

  useEffect(() => {
    const video = document.createElement('video')
    video.src = '/assets-local/autoplay-test/test' + '.' + (isMobile ? VidExt.Mp4 : VidExt.Webm)
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

  return { canAutoPlay, defaultCanAutoPlay }
}

export default useCanAutoPlay