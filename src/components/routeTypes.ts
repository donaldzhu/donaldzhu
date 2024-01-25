import type useVideoTest from '../hooks/useVideoTest'
import type usePreload from '../hooks/usePreload'

export interface RouteProps {
  mediaSettings: ReturnType<typeof useVideoTest> & ReturnType<typeof usePreload>
}