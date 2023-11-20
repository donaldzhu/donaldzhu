import _ from 'lodash'
import { ForwardedRef, forwardRef } from 'react'
import { MediaFileType } from '../../../utils/helpers/preloader/preloadUtils'
import Img from './img'
import { MediaIntrinsicProps, MediaRef } from './mediaTypes'
import Vid from './vid'

const Media = forwardRef((props: MediaIntrinsicProps, ref: MediaRef) => {
  return props.type === MediaFileType.Image ?
    <Img {..._.omit(props, 'type')} ref={ref as ForwardedRef<HTMLImageElement>} /> :
    <Vid {..._.omit(props, 'type')} ref={ref as ForwardedRef<HTMLVideoElement>} />
})

export default Media