// string
export const capitalize = string => string.charAt(0)
  .toUpperCase() + string.slice(1)

// number
export const map = (value, inMin, inMax, outMin, outMax) =>
  (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin
export const isOdd = number => !!(number % 2)

export const sum = array => array.reduce((prev, curr) => prev + curr)

// array
export const repeatMap = (repetition, callback) => {
  const accumulatedReturns = []
  for (let i = 0; i < repetition; i++)
    accumulatedReturns.push(callback(i, accumulatedReturns[i - 1], accumulatedReturns))
  return accumulatedReturns
}
export const arrayify = possibleArray => Array.isArray(possibleArray) ? possibleArray : [possibleArray]
export const shuffleTo = (array, index) => {
  array = [...array]
  return [...array.splice(index), ...array]
}

export const sortLike = (array, modelArray) =>
  array.sort((a, b) =>
    modelArray.indexOf(a) - modelArray.indexOf(b))


// object
export const mapObject = (object, callback) => {
  const keys = Object.keys(object)
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    const value = object[key]
    callback(key, value, object)
  }
  return object
}

export const keysToObject = (array, callback) =>
  array.reduce((obj, key, i) => ({
    ...obj, [key]: callback(key, obj, i)
  }), {})

// util
export const getVw = (percentage = 100) => window.innerWidth / 100 * percentage
export const getVh = (percentage = 100) => window.innerHeight / 100 * percentage
export const getRem = (multiplier = 1) => parseFloat(getComputedStyle(
  document.documentElement).fontSize) * multiplier

export const getNativeResolution = () => [
  window.screen.width * window.devicePixelRatio,
  window.screen.height * window.devicePixelRatio,
]

export const joinPaths = (...paths) => paths.filter(p => p).join('/')

export const getToolTipPoints = (toolTip, popUp) => {
  if (popUp.y2 >= toolTip.y2 && popUp.y1 <= toolTip.y1)
    return [toolTip.topRight, popUp.topRight, toolTip.botRight, popUp.botRight]
  if (popUp.y2 <= toolTip.y2)
    return [toolTip.topRight, popUp.topRight, toolTip.botLeft, popUp.botLeft]
  return [toolTip.topLeft, popUp.topLeft, toolTip.botRight, popUp.botRight]
}

// funuction 
export const callFunctionLike = functionLike => typeof functionLike === 'function' ? functionLike() : functionLike

