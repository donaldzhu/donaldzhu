import { ForwardedRef, forwardRef } from 'react'
import { MediaFileType } from '../../../utils/helpers/preloader/preloadUtils'
import { WorkVidProps } from './mediaTypes'
import ZoomMedia from './zoomMedia'

const WorkVid = forwardRef((
  props: WorkVidProps,
  ref: ForwardedRef<HTMLVideoElement>
) => {
  return <ZoomMedia {...props} ref={ref} preload='false' type={MediaFileType.Video} />
})



export default WorkVid