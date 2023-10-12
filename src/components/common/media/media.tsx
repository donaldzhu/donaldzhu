import { ForwardedRef, ImgHTMLAttributes, VideoHTMLAttributes, forwardRef } from 'react'
import Vid from './vid'
import Img from './img'
import { SINGLE_MEDIA_TYPES } from '../../../utils/helpers/preloader/preloadUtils'
import { ImgProps } from './mediaTypes'

type MediaProps<T extends keyof typeof SINGLE_MEDIA_TYPES> =
  (T extends typeof SINGLE_MEDIA_TYPES.image ?
    ImgHTMLAttributes<HTMLImageElement> & ImgProps :
    VideoHTMLAttributes<HTMLVideoElement>
  ) & { type: T }

const Media = forwardRef(function Media<T extends keyof typeof SINGLE_MEDIA_TYPES,>(
  { type, ...props }: MediaProps<T>,
  ref: T extends typeof SINGLE_MEDIA_TYPES.image ?
    ForwardedRef<HTMLImageElement> :
    ForwardedRef<HTMLVideoElement>
) {
  return type === SINGLE_MEDIA_TYPES.image ?
    <Img {...props} ref={ref} /> : <Vid {...props} ref={ref} />
})


export default Media