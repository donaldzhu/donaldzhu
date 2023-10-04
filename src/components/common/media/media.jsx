import { forwardRef } from 'react'
import { SINGLE_MEDIA_TYPES } from '../../../utils/helpers/preloader/preloadUtils'
import Vid from './vid'
import Img from './img'

const Media = forwardRef(({ type, ...props }, ref) => {
  return type === SINGLE_MEDIA_TYPES.image ?
    <Img {...props} ref={ref} /> : <Vid {...props} ref={ref} />
})

export default Media