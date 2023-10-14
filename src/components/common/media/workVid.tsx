import { ForwardedRef, forwardRef } from 'react'
import ZoomMedia from './zoomMedia'
import { MediaFileType } from '../../../utils/helpers/preloader/preloadUtils'
import { ZoomVidProps } from './mediaTypes'

const WorkVid = forwardRef(function WorkVid(props: ZoomVidProps, ref: ForwardedRef<HTMLVideoElement>) {
  return <ZoomMedia {...props} ref={ref} type={MediaFileType.Video} />
})



export default WorkVid