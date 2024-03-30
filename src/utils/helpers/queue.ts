import _ from 'lodash'

import { arrayify, filterFalsy } from '../commonUtils'

import type { queueArgType, queueFunctionType } from '../utilTypes'

class Queue<T = any> {
  private currentId: undefined | string
  private queueList: queueFunctionType<T>[]
  private initialQueueCount: undefined | number

  constructor(private interval?: number, private capacity = 1) {
    this.currentId = undefined
    this.queueList = []
    this.initialQueueCount = undefined
  }

  create(queueArgs: queueArgType<T>) {
    this.queueList = filterFalsy(arrayify(queueArgs))
    this.initialQueueCount = this.queueList.length
    const id = this.currentId = _.uniqueId()

    return new Promise<void>((resolve, reject) => {
      const serve = () => {
        const queueArg = this.queueList[0]
        if (!queueArg) return
        this.queueList.shift()
        let queueFunction = queueArg

        if (typeof queueFunction !== 'function')
          queueFunction = queueFunction.run

        const result = queueFunction()
        const promise = this.promisify<T | undefined>(result)

        promise.then(res => {
          const callback = typeof queueArg === 'object' ? queueArg.callback : null
          if (callback) callback(res)
          if (id !== this.currentId || !this.initialQueueCount)
            return reject('Queue has been aborted.')

          this.initialQueueCount--
          if (this.queueList.length) {
            if (this.interval !== undefined)
              setTimeout(() => serve(), this.interval)
            else serve()
          } else if (
            this.initialQueueCount === 0 ||
            !this.capacity ||
            this.capacity === 1
          ) resolve()

        }).catch(err => console.warn(err))
      }

      for (let i = 0; i < this.capacity; i++)
        serve()
    })
  }

  private promisify<P>(promiseLike: P) {
    return Array.isArray(promiseLike) ?
      Promise.all<P>(promiseLike) :
      Promise.resolve(promiseLike)
  }

  abort() {
    this.currentId = undefined
    this.initialQueueCount = undefined
  }

  push(...queueItems: queueFunctionType<T>[]) {
    if (!this.currentId || !this.initialQueueCount) return
    this.queueList.push(...queueItems)
    this.initialQueueCount += queueItems.length
  }

  pop() {
    if (!this.currentId || !this.initialQueueCount) return
    this.queueList.pop()
    this.initialQueueCount--
  }
}

export default Queue