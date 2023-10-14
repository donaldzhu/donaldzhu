import { ForwardedRef, forwardRef } from 'react'
import ZoomMedia from './zoomMedia'
import { MediaFileType } from '../../../utils/helpers/preloader/preloadUtils'
import { ZoomImgProps } from './mediaTypes'

const WorkImg = forwardRef(function WorkImg(props: ZoomImgProps, ref: ForwardedRef<HTMLImageElement>) {
  return <ZoomMedia {...props} ref={ref} type={MediaFileType.Image} />
})

export default WorkImg