import { forwardRef, useEffect, useState } from 'react'
import _ from 'lodash'
import Media from './media'
import { MEDIA_SIZES, isVid } from '../../../utils/helpers/preloader/preloadUtils'
import { getBreakpointKey } from '../../../utils/queryUtil'

const PreloadMedia = forwardRef((props, ref) => {
  const { mediaStack, isZoomed, type, fallbackPath, ...rest } = props

  const mediaIsVid = isVid(type)
  const getLoadState = (mediaStack = props.mediaStack) => {
    if (!mediaStack) return {
      src: fallbackPath,
      hasLoaded: true
    }

    let size = _.chain(mediaStack.loadedSizes)
      .without(mediaStack, isZoomed ? '' : MEDIA_SIZES.original)
      .last()
      .value()
    const hasLoaded = mediaIsVid || size

    if (mediaIsVid)
      size = isZoomed ? MEDIA_SIZES.original : getBreakpointKey()
    else size ||= MEDIA_SIZES.desktopFallback

    return {
      src: mediaStack.stack[size].src,
      hasLoaded
    }
  }

  const getPosterSrc = () => getLoadState(mediaStack?.posterStack).src

  const [loadState, setLoadState] = useState(getLoadState())
  const [posterSrc, setPosterSrc] = useState(mediaIsVid && getPosterSrc())

  useEffect(() => {
    setLoadState(getLoadState())
    setPosterSrc(getPosterSrc())
    if (!mediaStack) return _.noop
    const handleStackLoad = () => {
      const newSrc = getLoadState()
      const newPosterSrc = getPosterSrc()
      if (!(isZoomed && mediaIsVid))
        setLoadState(newSrc)
      if (mediaIsVid) setPosterSrc(newPosterSrc)
    }

    mediaStack.addLoadListener(handleStackLoad)
    return () => mediaStack.removeLoadListener(handleStackLoad)
  }, [mediaStack, fallbackPath])


  const [nativeW, nativeH] = mediaStack?.nativeDimension || []
  return <Media
    {...rest}
    type={type.slice(0, type.length - 1)}
    src={loadState.src}
    poster={posterSrc}
    hasLoaded={loadState.hasLoaded}
    aspectRatio={(nativeW / nativeH) || undefined}
    ref={ref} />
})


export default PreloadMedia