import { DependencyList, ReactNode, useEffect } from 'react'
import { useLocation, useOutletContext } from 'react-router-dom'
import { PageContextProps } from '../components/pageWrappers/pageTypes'

const useSidebar = (sidebar: ReactNode, dependencies: DependencyList = []) => {
  const { setSidebar } = useOutletContext<PageContextProps>()
  const location = useLocation()
  useEffect(() => {
    setSidebar(sidebar)
    return () => setSidebar(undefined)
  }, [location, ...dependencies])
}

export default useSidebar