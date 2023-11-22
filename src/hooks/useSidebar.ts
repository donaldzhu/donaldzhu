import { useEffect } from 'react'
import { useLocation, useOutletContext } from 'react-router-dom'
import type { DesktopContextProps } from '../components/desktop/pageWrappers/pageTypes'
import type { DependencyList, ReactNode } from 'react'

const useSidebar = (sidebar: ReactNode, dependencies: DependencyList = []) => {
  const { setSidebar } = useOutletContext<DesktopContextProps>()
  const location = useLocation()
  useEffect(() => {
    setSidebar(sidebar)
    return () => setSidebar(undefined)
  }, [location, ...dependencies])
}

export default useSidebar