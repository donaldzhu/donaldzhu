import _ from 'lodash'
import { forwardRef, useEffect, useState } from 'react'
import { MediaFileType, MediaSize } from '../../../utils/helpers/preloader/preloadUtils'
import { getPreloadBreakpt } from '../../../utils/queryUtil'
import Media from './media'
import { MediaRef, PreloadMediaProps } from './mediaTypes'

const PreloadMedia = forwardRef(PreloadMediaWithRef)

function PreloadMediaWithRef(props: PreloadMediaProps, ref: MediaRef) {
  const { mediaStack, isZoomed, fallbackPath, ...rest } = props

  const mediaIsVid = rest.type === MediaFileType.Video
  const getLoadState = (mediaStack = props.mediaStack) => {
    if (!mediaStack) return {
      src: fallbackPath,
      hasLoaded: true
    }

    let sizes = _.chain(mediaStack.loadedSizes)
    if (!isZoomed) sizes = sizes.without(MediaSize.Max)
    let size = _.last(sizes.value())

    const hasLoaded = mediaIsVid || !!size

    if (mediaIsVid)
      size = isZoomed ? MediaSize.Max : getPreloadBreakpt()
    else size ||= MediaSize.DesktopFallback

    return {
      src: mediaStack.stack[size].src,
      hasLoaded
    }
  }

  const [loadState, setLoadState] = useState(getLoadState())

  useEffect(() => {
    setLoadState(getLoadState())
    if (!mediaStack) return _.noop
    const handleStackLoad = () => {
      const newSrc = getLoadState()
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
    aspectRatio={((nativeW ?? 1) / (nativeH ?? 1))}
    ref={ref} />
}

export default PreloadMedia