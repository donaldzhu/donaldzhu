import { useMediaQuery } from '@uidotdev/usehooks'
import { desktopQuery } from '../utils/queryUtil'


const useIsMobile = () => !useMediaQuery(desktopQuery)

export default useIsMobile