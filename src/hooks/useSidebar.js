import { useEffect } from 'react'
import { useLocation, useOutletContext } from 'react-router-dom'

const useSidebar = (sidebar, dependencies = []) => {
  const { setSidebar } = useOutletContext()
  const location = useLocation()
  useEffect(() => {
    setSidebar(sidebar)
    return () => setSidebar()
  }, [location, ...dependencies])
}

export default useSidebar