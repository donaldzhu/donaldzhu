import _ from 'lodash'
import { forwardRef } from 'react'
import { MediaFileType } from '../../../utils/helpers/preloader/preloadUtils'
import Img from './img'
import Vid from './vid'
import type { ForwardedRef } from 'react'
import type { MediaIntrinsicProps, MediaRef } from './mediaTypes'

const Media = forwardRef(function Media(
  props: MediaIntrinsicProps & {
    poster?: string,
    posterFallback?: string,
    isZoomed?: boolean
  },
  ref: MediaRef
) {
  return props.type === MediaFileType.Image ?
    <Img {..._.omit(props, 'type', 'poster', 'posterFallback')} ref={ref as ForwardedRef<HTMLImageElement>} /> :
    <Vid {..._.omit(props, 'type', 'hasLoaded')} ref={ref as ForwardedRef<HTMLVideoElement>} />
})

export default Media