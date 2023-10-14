import { ForwardedRef, forwardRef } from 'react'
import _ from 'lodash'
import Vid from './vid'
import Img from './img'
import { MediaFileType } from '../../../utils/helpers/preloader/preloadUtils'
import { ImgIntrinsicProps, MediaIntrinsicProps, VidIntrinsicProps } from './mediaTypes'

const Media = forwardRef(MediaWithRef)

function MediaWithRef(props: MediaIntrinsicProps, ref: ForwardedRef<HTMLImageElement | HTMLVideoElement>) {
  return props.type === MediaFileType.Image ?
    <Img {..._.omit(props, 'type')} ref={ref as ForwardedRef<HTMLImageElement>} /> :
    <Vid {..._.omit(props, 'type')} ref={ref as ForwardedRef<HTMLVideoElement>} />
}
export default Media