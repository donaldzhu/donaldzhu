import { forwardRef } from 'react'
import ZoomMedia from './zoomMedia'
import { MEDIA_TYPES } from '../../../utils/helpers/preloader/preloadUtils'

const WorkVid = forwardRef(function WorkVid(props, ref) {
  return <ZoomMedia {...props} ref={ref} type={MEDIA_TYPES.videos} />
})



export default WorkVid