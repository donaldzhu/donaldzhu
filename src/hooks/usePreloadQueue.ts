import _ from 'lodash'
import { useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import type { DependencyList } from 'react'
import type PreloadManager from '../utils/helpers/preloader/preloadManager'
import type { DesktopContextProps } from '../components/desktop/pageWrappers/pageTypes'

const usePreloadQueue = (
  setupDone: boolean,
  callback: (preloadManager: PreloadManager) => void,
  dependencies: DependencyList = []
) => {
  const { preloadManager } = useOutletContext<DesktopContextProps>()
  useEffect(() => {
    if (!setupDone || !preloadManager) return _.noop
    callback(preloadManager)
    return () => preloadManager.abort()
  }, [preloadManager, setupDone, ...dependencies])
}

export default usePreloadQueue