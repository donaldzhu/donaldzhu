import { forwardRef } from 'react'
import ZoomMedia from './zoomMedia'
import { MediaType } from '../../../utils/helpers/preloader/preloadUtils'

const WorkVid = forwardRef(function WorkVid(props, ref) {
  return <ZoomMedia {...props} ref={ref} type={MediaType.Videos} />
})



export default WorkVid