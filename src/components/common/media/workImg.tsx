import { forwardRef } from 'react'
import { MediaFileType } from '../../../utils/helpers/preloader/preloadUtils'
import ZoomMedia from './zoomMedia'
import type { ForwardedRef } from 'react'
import type { WorkImgProps } from './mediaTypes'

const WorkImg = forwardRef((
  props: WorkImgProps,
  ref: ForwardedRef<HTMLImageElement>
) => {
  return <ZoomMedia {...props} ref={ref} type={MediaFileType.Image} />
})

export default WorkImg