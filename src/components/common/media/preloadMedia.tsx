import _ from 'lodash'
import { forwardRef, useEffect, useState } from 'react'
import { MediaFileType, MediaSize } from '../../../utils/helpers/preloader/preloadUtils'
import { getBreakptKey } from '../../../utils/queryUtil'
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

    const sizes = _.chain(mediaStack.loadedSizes)
    if (!isZoomed) sizes.without(MediaSize.Max)
    let size = _.last(sizes.value())

    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const hasLoaded = mediaIsVid || !!size

    if (mediaIsVid)
      size = isZoomed ? MediaSize.Max : getBreakptKey()
    else size ||= MediaSize.DesktopFallback

    return {
      src: mediaStack.stack[size].src,
      hasLoaded
    }
  }

  const getPosterSrc = () => mediaStack && 'posterStack' in mediaStack ?
    getLoadState(mediaStack.posterStack).src :
    undefined

  const [loadState, setLoadState] = useState(getLoadState())
  const [posterSrc, setPosterSrc] = useState(mediaIsVid ? getPosterSrc() : undefined)

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


  const [nativeW, nativeH] = mediaStack?.nativeDimension ?? []

  return <Media
    {...rest}
    {...(rest.type === MediaFileType.Video ?
      { poster: posterSrc } : {})}
    src={loadState.src}
    hasLoaded={loadState.hasLoaded}
    aspectRatio={((nativeW ?? 1) / (nativeH ?? 1))}
    ref={ref} />
}

export default PreloadMedia