import _ from 'lodash'
import { forwardRef, useEffect, useState } from 'react'
import { MediaFileType, MediaSize, orderedBreakpts } from '../../../utils/helpers/preloader/preloadUtils'
import { getBreakptKey } from '../../../utils/queryUtil'
import { sortLike } from '../../../utils/commonUtils'
import Media from './media'
import type { MediaRef, PreloadMediaProps } from './mediaTypes'
import type { MediaBreakpts } from '../../../utils/helpers/preloader/preloaderTypes'

const PreloadMedia = forwardRef((props: PreloadMediaProps, ref: MediaRef) => {
  const { stackData, isZoomed, fallbackPath, ...rest } = props
  const mediaStack = stackData?.stack

  const mediaIsVid = rest.type === MediaFileType.Video
  const getLoadState = (mediaStack = stackData?.stack) => {
    if (!mediaStack) return {
      src: fallbackPath,
      hasLoaded: true
    }

    let sizes = _.chain(sortLike(mediaStack.loadedSizes, orderedBreakpts))

    if (!isZoomed) sizes = sizes.without(MediaSize.Max)
    let size = _.last(sizes.value())

    const hasLoaded = mediaIsVid || !!size

    if (mediaIsVid)
      size = isZoomed ? MediaSize.Max : getBreakptKey()
    else size ||= MediaSize.DesktopFallback

    return {
      src: mediaStack.stack[size as MediaBreakpts].src,
      hasLoaded
    }
  }

  const [loadState, setLoadState] = useState(getLoadState())

  useEffect(() => {
    setLoadState(getLoadState())
    if (!mediaStack) return _.noop
    const handleStackLoad = () => {
      const newSrc = getLoadState()
      // console.log(newSrc)
      if (!(isZoomed && mediaIsVid)) setLoadState(newSrc)
    }

    mediaStack.addLoadListener(handleStackLoad)
    return () => mediaStack.removeLoadListener(handleStackLoad)
  }, [mediaStack, fallbackPath])


  const [nativeW, nativeH] = mediaStack?.nativeDimension ?? []

  return <Media
    {...rest}
    src={loadState.src}
    hasLoaded={loadState.hasLoaded}
    aspectRatio={!nativeW || !nativeH ? undefined : nativeW / nativeH}
    ref={ref} />
})

export default PreloadMedia