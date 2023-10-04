import { useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import _ from 'lodash'

const usePreloadQueue = (setupDone, callback, dependencies = []) => {
  const { preloadManager } = useOutletContext()
  useEffect(() => {
    if (!setupDone || !preloadManager) return _.noop
    callback(preloadManager)
    return () => {
      preloadManager.abort()
    }
  }, [preloadManager, setupDone, ...dependencies])
}

export default usePreloadQueue