import { forwardRef } from 'react'
import ZoomMedia from './zoomMedia'
import { MediaFileType } from '../../../utils/helpers/preloader/preloadUtils'

const WorkImg = forwardRef(function WorkImg(props, ref) {
  return <ZoomMedia {...props} ref={ref} type={MediaFileType.Image} />
})

export default WorkImg