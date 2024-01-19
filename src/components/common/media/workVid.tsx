import { forwardRef } from 'react'
import { MediaFileType } from '../../../utils/helpers/preloader/preloadUtils'
import ZoomMedia from './zoomMedia'
import type { ForwardedRef } from 'react'
import type { WorkVidProps } from './mediaTypes'

const WorkVid = forwardRef(function WorkVid(
  props: WorkVidProps,
  ref: ForwardedRef<HTMLVideoElement>
) {
  return <ZoomMedia {...props} ref={ref} preload='false' type={MediaFileType.Video} />
})



export default WorkVid