import { forwardRef, useEffect, useState } from 'react'
import VidHelper from '../../../utils/helpers/video/vidHelper'
import { MediaFileType, MediaSize, getFallbackKey, getStackBreakpt } from '../../../utils/helpers/preloader/preloadUtils'
import { getBreakptKey } from '../../../utils/queryUtil'
import useIsMobile from '../../../hooks/useIsMobile'
import Media from './media'
import type { MediaRef, PreloadMediaProps } from './mediaTypes'


const PreloadMedia = forwardRef(function PreloadMedia(props: PreloadMediaProps, ref: MediaRef) {
  const { stackData, isZoomed, ...rest } = props
  const mediaStack = stackData.stack
  const posterStack = mediaStack.posters

  const isDesktop = !useIsMobile()
  const isVid = rest.type === MediaFileType.Video
  const canUseDash = VidHelper.canUseDash

  const getLoadedBreakpt = () => getStackBreakpt(mediaStack, isZoomed)
  const getMediaPath = () => {
    if (canUseDash && isVid && mediaStack.dashPath)
      return mediaStack.dashPath
    const size = isVid ? (
      (isZoomed && isDesktop) ? MediaSize.Max : getBreakptKey(mediaStack.device)
    ) : (
      getLoadedBreakpt() ?? getFallbackKey()
    )
    return mediaStack.stack[size].src
  }

  const getPosterPath = () => {
    if (!posterStack) return undefined
    const loadedSize = getStackBreakpt(posterStack, isZoomed) ?? getFallbackKey()
    return posterStack.stack[loadedSize].src
  }

  const [path, setPath] = useState(getMediaPath())
  const [posterPath, setPosterPath] = useState(getPosterPath())
  const [nativeW, nativeH] = mediaStack.nativeDimension

  useEffect(
    mediaStack.addLoadListener(() => {
      if (!isVid) setPath(getMediaPath())
      else setPosterPath(getPosterPath())
    }), [mediaStack]
  )

  return <Media
    {...rest}
    src={path}
    poster={posterPath}
    hasLoaded={!!getLoadedBreakpt()}
    aspectRatio={nativeW / nativeH}
    isZoomed={isZoomed}
    ref={ref} />
})

export default PreloadMedia