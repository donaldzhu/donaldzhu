import { ForwardedRef, forwardRef } from 'react'
import { MediaFileType } from '../../../utils/helpers/preloader/preloadUtils'
import { WorkImgProps } from './mediaTypes'
import ZoomMedia from './zoomMedia'

const WorkImg = forwardRef(function WorkImg(
  props: WorkImgProps,
  ref: ForwardedRef<HTMLImageElement>
) {
  return <ZoomMedia {...props} ref={ref} type={MediaFileType.Image} />
})

export default WorkImg