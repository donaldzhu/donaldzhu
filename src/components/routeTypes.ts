import type useCanAutoPlay from '../hooks/useCanAutoPlay'
import type usePreload from '../hooks/usePreload'

export interface RouteProps {
  mediaSettings: ReturnType<typeof useCanAutoPlay> & ReturnType<typeof usePreload>
}