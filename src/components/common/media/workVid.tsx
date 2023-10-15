import { ForwardedRef, forwardRef } from 'react'
import { MediaFileType } from '../../../utils/helpers/preloader/preloadUtils'
import { WorkVidProps } from './mediaTypes'
import ZoomMedia from './zoomMedia'

const WorkVid = forwardRef(function WorkVid(props: WorkVidProps, ref: ForwardedRef<HTMLVideoElement>) {
  return <ZoomMedia {...props} ref={ref} type={MediaFileType.Video} />
})



export default WorkVid