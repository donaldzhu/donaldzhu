import { useEffect, useMemo, useState } from 'react'
import _ from 'lodash'
import PreloadManager from '../utils/helpers/preloader/preloadManager'

const usePreload = canAutoPlay => {
  const [vidLoadData, setVidLoadData] = useState({})

  const loadVid = (src, threshold) => {
    if (vidLoadData[src]) return Promise.resolve()
    const loadData = {}
    loadData.promise = new Promise(resolve =>
      loadData.onProgress = ({ currentTarget }) => {
        if (currentTarget.buffered.length === 0) return
        const percentage = currentTarget.buffered.end(0) / currentTarget.duration
        if (percentage >= threshold) {
          resolve()
          setVidLoadData(prev => _.omit(prev, [src]))
        }
      })
    setVidLoadData(prev => ({ ...prev, [src]: loadData }))
    return loadData.promise
  }

  const preloadManager = useMemo(() => new PreloadManager(canAutoPlay, loadVid), [])

  useEffect(() => {
    preloadManager.autoPlayConfig.canAutoPlay = canAutoPlay
    preloadManager.restart()
  }, [canAutoPlay])
  return { vidLoadData, preloadManager }
}

export default usePreload