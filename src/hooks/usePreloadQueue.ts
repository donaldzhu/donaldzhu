import { DependencyList, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import _ from 'lodash'
import PreloadManager from '../utils/helpers/preloader/preloadManager'
import { PageContextProps } from '../components/pageWrappers/pageTypes'

const usePreloadQueue = (
  setupDone: boolean,
  callback: (preloadManager: PreloadManager) => any,
  dependencies: DependencyList = []
) => {
  const { preloadManager } = useOutletContext<PageContextProps>()
  useEffect(() => {
    if (!setupDone || !preloadManager) return _.noop
    callback(preloadManager)
    return () => {
      preloadManager.abort()
    }
  }, [preloadManager, setupDone, ...dependencies])
}

export default usePreloadQueue