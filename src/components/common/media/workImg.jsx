import { forwardRef } from 'react'
import ZoomMedia from './zoomMedia'
import { MediaType } from '../../../utils/helpers/preloader/preloadUtils'

const WorkImg = forwardRef(function WorkImg(props, ref) {
  return <ZoomMedia {...props} ref={ref} type={MediaType.Images} />
})

export default WorkImg