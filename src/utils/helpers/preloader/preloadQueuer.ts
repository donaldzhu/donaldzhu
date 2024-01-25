import _ from 'lodash'
import Queue from '../queue'
import { MediaFileType } from './preloadUtils'
import type { MediaStack } from './mediaStack'
import type { queueArgType } from '../../utilTypes'

interface PreloadQueuerProps {
  queueInterval?: number | null
  queueCount?: number | null
  enabled?: boolean
}

export type PreloadStack<T extends object, S extends string> = ({
  stack: MediaStack<S>
} & T)

class PreloadQueuer<T extends object, S extends string> {
  private queueCount: number
  private mainQueue: Queue
  private mainQueueFunctions: queueArgType<any> | undefined
  private subqueues: Queue[]
  private interval: number | undefined

  enabled: boolean
  isComplete: boolean
  mediaStacks: PreloadStack<T, S>[]

  constructor(config?: PreloadQueuerProps) {
    const {
      enabled,
      queueInterval,
      queueCount
    } = config ?? {}

    this.interval = queueInterval ?? undefined

    this.queueCount = queueCount ?? 1
    this.mainQueue = new Queue(this.interval)
    this.mainQueueFunctions = undefined

    this.subqueues = []

    this.enabled = enabled ?? true
    this.isComplete = false
    this.mediaStacks = []
  }

  preload(
    size: S | undefined,
    isPoster: boolean,
    filter: (stackData: PreloadStack<T, S>) => boolean,
    sort?: (a: PreloadStack<T, S>, b: PreloadStack<T, S>) => number
  ) {
    if (!size) return Promise.resolve(false)
    sort ??= (a: PreloadStack<T, S>, b: PreloadStack<T, S>) =>
      a.stack.fileName.localeCompare(b.stack.fileName)

    const filteredStacks = this.mediaStacks.filter(stackData =>
      (
        !isPoster || stackData.stack.fileType === MediaFileType.Video
      ) && filter(stackData)
    )
    const sortedStacks = filteredStacks.sort(sort)
    if (!sortedStacks.length) return Promise.resolve(false)
    return this.addToSubqueue(sortedStacks.map(stackData =>
      () => stackData.stack.preload(size, isPoster)))
  }

  createMainQueue<T = void>(queueFunctions: queueArgType<T>) {
    if (!this.enabled || this.isComplete) return Promise.resolve(false)
    this.mainQueueFunctions = queueFunctions

    const queue = this.mainQueue.create(queueFunctions)
    queue
      .then(() => this.onFinish())
      .catch(_.noop)
    return queue
  }

  addToSubqueue<T = void>(queueFunctions: queueArgType<T>) {
    if (!queueFunctions) return Promise.resolve(false)
    const queue = new Queue(this.interval, this.queueCount)
    this.subqueues.push(queue)
    return queue.create(queueFunctions)
      .then(() => _.pull(this.subqueues, queue))
      .catch(_.noop)
  }

  abort() {
    if (!this.enabled) return
    this.mainQueue.abort()
    this.subqueues.forEach(queue => queue.abort())
    this.subqueues = []
  }

  restart() {
    if (!this.mainQueueFunctions) return
    this.abort()
    this.isComplete = false
    this.createMainQueue(this.mainQueueFunctions)
  }

  private onFinish() {
    this.isComplete = true
  }
}

export default PreloadQueuer