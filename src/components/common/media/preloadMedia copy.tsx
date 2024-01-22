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
  const isMobile = useIsMobile()
  const canUseDash = VidHelper.canUseDash

  const mediaIsVid = rest.type === MediaFileType.Video
  const getLoadState = (mediaStack = stackData?.stack) => {
    if (!mediaStack) return {
      src: fallbackPath,
      hasLoaded: true
    }

    if (canUseDash && mediaIsVid) return {
      src: mediaStack.dashPath,
      hasLoaded: false
    }

    let size = getStackBreakpt(mediaStack, isZoomed)

    const hasLoaded = !mediaIsVid || !!size

    if (mediaIsVid && mediaStack !== posterStack)
      size = isZoomed && !isMobile ? MediaSize.Max : getBreakptKey(Device.Mobile)
    else size ||= getFallbackKey()

    return {
      src: mediaStack.stack[size as MediaBreakpts].src,
      hasLoaded
    }
  }

  const [loadState, setLoadState] = useState(getLoadState())
  const [posterLoadState, setPosterLoadState] = useState(getLoadState(posterStack))

  useEffect(() => {
    const newLoadState = getLoadState()
    if (!_.isEqual(newLoadState, loadState))
      setLoadState(newLoadState)

    if (!mediaStack || canUseDash && mediaIsVid) return _.noop
    const handleStackLoad = (isPoster = false) => {
      const newLoadState = getLoadState(isPoster ? posterStack : undefined)
      if (isZoomed ?? (mediaIsVid && !isPoster)) return

      if (isPoster) {
        if (!_.isEqual(newLoadState, posterLoadState))
          setPosterLoadState(newLoadState)
      } else if (!_.isEqual(newLoadState, loadState))
        setLoadState(newLoadState)
    }

    const handleMediaStackLoad = () => handleStackLoad(false)
    const handlePosterStackLoad = () => handleStackLoad(true)

    mediaStack.addLoadListener(
      handleMediaStackLoad,
      handlePosterStackLoad
    )

    return () =>
      mediaStack.removeLoadListener(
        handleMediaStackLoad,
        handlePosterStackLoad
      )
  }, [mediaStack, fallbackPath])

  const [nativeW, nativeH] = mediaStack?.nativeDimension ?? []

  return <Media
    {...rest}
    src={loadState.src}
    poster={posterStack ? posterLoadState.src : undefined}
    hasLoaded={loadState.hasLoaded}
    aspectRatio={!nativeW || !nativeH ? undefined : nativeW / nativeH}
    ref={ref} />
})

export default PreloadMedia