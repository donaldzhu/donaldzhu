import _ from 'lodash'
import { arrayify } from '../commonUtils'

class Queue {
  constructor(interval) {
    this.currentId = undefined
    this.interval = interval
  }

  create(queueFunctions) {
    queueFunctions = arrayify(queueFunctions).filter(fn => fn)
    return new Promise((resolve, reject) => {
      const id = this.currentId = Date.now()
      const serve = i => {
        let queueFunction = queueFunctions[i] || _.noop
        if (typeof queueFunction !== 'function' && queueFunction.run)
          queueFunction = queueFunction.run
        const promise = this._promisify(queueFunction())
        promise.then(() => {
          if (queueFunctions[i]?.callback) queueFunctions[i].callback(i)
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

  _promisify(promiseLike) {
    return Array.isArray(promiseLike) ?
      Promise.all(promiseLike) :
      Promise.resolve(promiseLike)
  }

  abort() {
    this.currentId = undefined
  }
}

export default Queue