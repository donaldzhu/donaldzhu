import { arrayify, filterFalsy } from '../commonUtils'
import { queueArgType } from '../utilTypes'

class Queue {
  private currentId: undefined | number
  private interval: undefined | number
  constructor(interval?: number) {
    this.currentId = undefined
    this.interval = interval
  }

  create<T>(queueArgs: queueArgType<T>) {
    const queueFunctions = filterFalsy(arrayify(queueArgs))
    return new Promise<void>((resolve, reject) => {
      const id = this.currentId = Date.now()
      const serve = () => {
        const queueArg = queueFunctions[0]
        queueFunctions.shift()
        let queueFunction = queueArg

        if (queueFunction && typeof queueFunction !== 'function')
          queueFunction = queueFunction.run

        const result = queueFunction ? queueFunction() : undefined
        const promise = this.promisify<T | undefined>(result)

        promise.then(() => {
          const callback = typeof queueArg === 'object' ? queueArg.callback : null
          if (callback) callback()
          if (id !== this.currentId) return reject()
          if (queueFunctions.length) {
            if (this.interval !== undefined)
              setTimeout(() => serve(), this.interval)
            else serve()
          } else resolve()
        })
      }
      serve()
    })
  }

  private promisify<T>(promiseLike: T) {
    return Array.isArray(promiseLike) ?
      Promise.all<T>(promiseLike) :
      Promise.resolve(promiseLike)
  }

  abort() {
    this.currentId = undefined
  }
}

export default Queue