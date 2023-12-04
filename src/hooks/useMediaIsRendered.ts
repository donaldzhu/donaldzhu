import _ from 'lodash'
import { useEffect, useState, type RefObject } from 'react'
import { addEventListener } from '../utils/reactUtils'


const useMediaIsRendered = <T extends HTMLImageElement | HTMLVideoElement>(
  ref: RefObject<T>
) => {
  const [isRendered, setIsRendered] = useState(false)

  useEffect(() => {
    const media = ref.current
    if (!media) return

    const mediaIsVid = (media: HTMLElement):
      media is HTMLVideoElement => media.tagName === 'VIDEO'

    let removeRenderListener = _.noop

    if (mediaIsVid(media))
      removeRenderListener = addEventListener(
        media, 'playing', () => setIsRendered(true))
    else {
      if (media.complete) setIsRendered(true)
      else removeRenderListener = addEventListener(
        media, 'load', () => setIsRendered(true))
    }

    return removeRenderListener
  }, [])

  return isRendered
}

export default useMediaIsRendered