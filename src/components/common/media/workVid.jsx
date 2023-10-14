import { forwardRef } from 'react'
import ZoomMedia from './zoomMedia'
import { MediaFileType } from '../../../utils/helpers/preloader/preloadUtils'

const WorkVid = forwardRef(function WorkVid(props, ref) {
  return <ZoomMedia {...props} ref={ref} type={MediaFileType.Video} />
})



export default WorkVid