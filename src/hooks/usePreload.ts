import _ from 'lodash'
import { useEffect, useMemo, useState } from 'react'
import PreloadManager from '../utils/helpers/preloader/preloadManager'
import type { ReactEventHandler } from 'react'
import type { PreloaderConfig } from '../utils/helpers/preloader/preloaderTypes'

interface LoadDataInterface {
  promise: Promise<void>
  onProgress: ReactEventHandler<HTMLVideoElement>
}

const usePreload = (config: PreloaderConfig) => {
  const [vidLoadData, setVidLoadData] = useState<Record<string, LoadDataInterface | undefined>>({})

  const loadNativeVid = (src: string, threshold: number) => {
    if (vidLoadData[src]) return Promise.resolve()
    const loadData: Partial<LoadDataInterface> = {}
    loadData.promise = new Promise(resolve =>
      loadData.onProgress = ({ currentTarget }) => {
        if (currentTarget.buffered.length === 0) return
        const percentage = currentTarget.buffered.end(0) / currentTarget.duration
        if (percentage >= threshold) {
          resolve()
          setVidLoadData(prev => _.omit(prev, [src]))
        }
      })
    setVidLoadData(prev => ({ ...prev, [src]: loadData as LoadDataInterface }))
    return loadData.promise
  }

  const preloadManager = useMemo(() => new PreloadManager(config, loadNativeVid), [])

  useEffect(() => {
    Object.assign(preloadManager.config, config)
    preloadManager.restart()
  }, [config.canAutoPlay, config.isMobile])

  return { vidLoadData, preloadManager }
}

export default usePreload