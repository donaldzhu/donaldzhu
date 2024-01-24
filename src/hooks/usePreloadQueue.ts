import { useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import type { DependencyList } from 'react'
import type PreloadManager from '../utils/helpers/preloader/preloadManager'
import type { DesktopContextProps } from '../components/desktop/pageWrappers/pageTypes'
import type { MobileContextProps } from '../components/mobile/pageWrappers/pageTypes'

const usePreloadQueue = (
  setupDone: boolean,
  callback: (preloadManager: PreloadManager) => void,
  dependencies: DependencyList = []
) => {
  const { preloadManager } = useOutletContext<DesktopContextProps | MobileContextProps>()
  useEffect(() => {
    if (!setupDone) return
    callback(preloadManager)
    return () => preloadManager.abort()
  }, [!!preloadManager, setupDone, ...dependencies])
}

export default usePreloadQueue