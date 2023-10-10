import _ from 'lodash'
import { arrayify } from '../commonUtils.ts'

type queueFunctionType<T> = (() => T) | {
  run: () => T,
  callback: () => void
}

class Queue {
  currentId: undefined | number
  interval: undefined | number
  constructor(interval?: number) {
    this.currentId = undefined
    this.interval = interval
  }

  create<T>(queueArgs: queueFunctionType<T> | queueFunctionType<T>[]) {
    const queueFunctions = arrayify(queueArgs).filter(fn => fn)
    return new Promise<void>((resolve, reject) => {
      const id = this.currentId = Date.now()
      const serve = (i: number) => {
        const queueArg = queueFunctions[i]
        let queueFunction = queueArg

        if (queueFunction && typeof queueFunction !== 'function')
          queueFunction = queueFunction.run

        const promise = queueFunction ? this.promisify<T>(queueFunction()) : this.promisify(_.noop)
        promise.then(() => {
          const callback = typeof queueArg === 'object' ? queueArg.callback : null
          if (callback) callback()
          if (id !== this.currentId) return reject()
          if (i + 1 <= queueFunctions.length) {
            if (this.interval !== undefined)
              setTimeout(() => serve(i + 1), this.interval)
            else serve(i + 1)
          } else resolve()
        })
      }
      serve(0)
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