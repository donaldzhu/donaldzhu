import { ForwardedRef, ImgHTMLAttributes, VideoHTMLAttributes, forwardRef } from 'react'
import Vid from './vid'
import Img from './img'
import { MediaFileType } from '../../../utils/helpers/preloader/preloadUtils'
import { ImgProps, VidProps } from './mediaTypes'

type MediaProps<T extends MediaFileType> =
  (T extends MediaFileType.Image ?
    ImgHTMLAttributes<HTMLImageElement> & ImgProps :
    VideoHTMLAttributes<HTMLVideoElement> & VidProps
  ) & { type: T }

const Media = forwardRef(function Media<T extends MediaFileType,>(
  { type, ...props }: MediaProps<T>,
  ref: T extends typeof MediaFileType.Image ?
    ForwardedRef<HTMLImageElement> :
    ForwardedRef<HTMLVideoElement>
) {
  return type === MediaFileType.Image ?
    //@ts-ignore // TODO
    <Img {...props} ref={ref} /> : <Vid {...props} ref={ref} />
})


export default Media