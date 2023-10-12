import { DependencyList, Dispatch, ReactNode, SetStateAction, useEffect } from 'react'
import { useLocation, useOutletContext } from 'react-router-dom'

const useSidebar = (sidebar: ReactNode, dependencies: DependencyList = []) => {
  // TODO
  const { setSidebar } = useOutletContext() as { setSidebar: Dispatch<SetStateAction<any>> }
  const location = useLocation()
  useEffect(() => {
    setSidebar(sidebar)
    return () => setSidebar(undefined)
  }, [location, ...dependencies])
}

export default useSidebar