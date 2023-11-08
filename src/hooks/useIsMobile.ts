import { useMediaQuery } from '@uidotdev/usehooks'
import { minQueries } from '../utils/queryUtil'


const useIsMobile = () => !useMediaQuery(minQueries.l)

export default useIsMobile