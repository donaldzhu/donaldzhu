import _ from 'lodash'
import { forwardRef, useEffect, useState } from 'react'
import VidHelper from '../../../utils/helpers/video/vidHelper'
import { MediaFileType, MediaSize, MediaType, getFallbackKey, getStackBreakpt } from '../../../utils/helpers/preloader/preloadUtils'
import { getBreakptKey } from '../../../utils/queryUtil'
import useIsMobile from '../../../hooks/useIsMobile'
import { Device } from '../../../utils/breakptTypes'
import Media from './media'
import type { MediaRef, PreloadMediaProps } from './mediaTypes'
import type { MediaBreakpts } from '../../../utils/helpers/preloader/preloaderTypes'

const PreloadMedia = forwardRef(function PreloadMedia(props: PreloadMediaProps, ref: MediaRef) {
  const { stackData, isZoomed, fallbackPath, ...rest } = props
  const mediaStack = stackData?.stack
  const posterStack = rest.type === MediaFileType.Image ? undefined :
    mediaStack?.posters

  const canUseDash = VidHelper.canUseDash
  const isMobile = useIsMobile()
  const mediaIsVid = rest.type === MediaFileType.Video

  const getMediaPath = (mediaStack = stackData?.stack) => {
    const isPosterStack = mediaStack === posterStack
    const getPath = () => {
      if (!mediaStack) return fallbackPath
      if (canUseDash && mediaIsVid) return mediaStack.dashPath

      let size = getStackBreakpt(mediaStack, isZoomed)

      if (mediaIsVid && !isPosterStack)
        size = isZoomed && !isMobile ? MediaSize.Max : getBreakptKey(Device.Mobile)
      else size ||= getFallbackKey()

      return mediaStack.stack[size as MediaBreakpts].src
    }

    const posterFallbackPath = // mediaStack?.posterFallback ??
      ''
    if (isPosterStack) console.log(posterFallbackPath)
    return getPath() ?? (isPosterStack ? posterFallbackPath : fallbackPath)
  }

  const [path, setPath] = useState(getMediaPath())
  const [posterPath] = useState(getMediaPath(posterStack))

  useEffect(() => {
    if (!mediaStack || canUseDash && mediaIsVid) return _.noop

    const setNewLoadState = (condition = true) => {
      const newLoadState = getMediaPath()
      if (condition && !_.isEqual(newLoadState, path))
        setPath(newLoadState)
    }

    const handleStackLoad = () => setNewLoadState(!mediaIsVid)
    mediaStack.addLoadListener(handleStackLoad)
    return () => mediaStack.removeLoadListener(handleStackLoad)
  }, [])

  const [nativeW, nativeH] = mediaStack?.nativeDimension ?? []

  return <Media
    {...rest}
    src={path}
    poster={posterPath}
    hasLoaded={true}
    aspectRatio={!nativeW || !nativeH ? undefined : nativeW / nativeH}
    ref={ref} />
})

export default PreloadMedia