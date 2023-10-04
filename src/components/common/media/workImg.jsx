import { forwardRef } from 'react'
import ZoomMedia from './zoomMedia'
import { MEDIA_TYPES } from '../../../utils/helpers/preloader/preloadUtils'

const WorkImg = forwardRef((props, ref) =>
  <ZoomMedia {...props} ref={ref} type={MEDIA_TYPES.images} />)

export default WorkImg