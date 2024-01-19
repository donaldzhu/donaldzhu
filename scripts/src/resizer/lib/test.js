const fs = require('fs')

const bitrateMap = JSON.parse(fs.readFileSync('src/data/media/bitrate-map.json'))

const DASH_CONFIG = Object.keys(bitrateMap)
  .map(bitrate => parseInt(bitrate))
  .sort((a, b) => a - b)
  .map(bitrate => {
    const size = bitrateMap[`${bitrate}`]
    return {
      size,
      bitrate: bitrate / 1000 + 'k',
      frameRate: size >= 720 ? 30 : 24
    }
  })

console.log(DASH_CONFIG)