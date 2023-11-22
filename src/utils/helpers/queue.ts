import { arrayify, filterFalsy } from '../commonUtils'
import type { queueArgType, queueFunctionType } from '../utilTypes'

class Queue<T = any> {
  private currentId: undefined | number
  private interval: undefined | number
  queueList: queueFunctionType<T>[]
  constructor(interval?: number) {
    this.currentId = undefined
    this.interval = interval
    this.queueList = []
  }

  create(queueArgs: queueArgType<T>) {
    this.queueList = filterFalsy(arrayify(queueArgs))
    return new Promise<void>((resolve, reject) => {
      const id = this.currentId = Date.now()
      const serve = () => {
        const queueArg = this.queueList[0]
        this.queueList.shift()
        let queueFunction = queueArg

        if (queueFunction && typeof queueFunction !== 'function')
          queueFunction = queueFunction.run

        const result = queueFunction ? queueFunction() : undefined
        const promise = this.promisify<T | undefined>(result)

        promise.then(() => {
          const callback = typeof queueArg === 'object' ? queueArg.callback : null
          if (callback) callback()
          if (id !== this.currentId) return reject()
          if (this.queueList.length) {
            if (this.interval !== undefined)
              setTimeout(() => serve(), this.interval)
            else serve()
          } else resolve()
        })
      }
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