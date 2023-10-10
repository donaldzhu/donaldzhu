export class Enum<T extends string | number | symbol> {
  readonly keys: T[]
  constructor(keys: T[], startingIndex = 0) {
    this.keys = keys
    keys.forEach((key, i) => (this as Record<T, number>)[key] = i + startingIndex)
    Object.defineProperty(this, 'keys', {
      enumerable: false
    })
  }
}

export const createStringEnum = <T extends string>(keys: T[]) => {
  const result: Partial<Record<T, T>> = {}
  keys.forEach(key => result[key] = key)
  return result as Record<T, T>
}