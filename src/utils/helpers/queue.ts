import { arrayify, filterFalsy } from '../commonUtils'
import type { queueArgType, queueFunctionType } from '../utilTypes'

class Queue<T = any> {
  private currentId: undefined | number
  private interval: undefined | number
  queueList: queueFunctionType<T>[]
  capacity: number

  constructor(interval?: number, capacity = 1) {
    this.currentId = undefined
    this.interval = interval
    this.queueList = []
    this.capacity = capacity
  }

  create(queueArgs: queueArgType<T>) {
    this.queueList = filterFalsy(arrayify(queueArgs))
    return new Promise<void>((resolve, reject) => {
      const id = this.currentId = Date.now()
      const serve = () => {
        const queueArg = this.queueList[0]
        if (!queueArg) return
        this.queueList.shift()
        let queueFunction = queueArg

        if (queueFunction && typeof queueFunction !== 'function')
          queueFunction = queueFunction.run

        const result = queueFunction ? queueFunction() : undefined
        const promise = this.promisify<T | undefined>(result)

        promise
          .then(res => {
            const callback = typeof queueArg === 'object' ? queueArg.callback : null
            if (callback) callback(res)
            if (id !== this.currentId) return reject('Queue has been aborted.')
            if (this.queueList.length) {
              if (this.interval !== undefined)
                setTimeout(() => serve(), this.interval)
              else serve()
            } else resolve()
          })
          .catch(err => console.warn(err))
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
  }
}

export default Queue