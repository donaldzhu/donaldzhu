import { useMediaQuery } from '@uidotdev/usehooks'
import { queries } from '../utils/queryUtil'


const useIsMobile = () => !useMediaQuery(queries.l)

export default useIsMobile