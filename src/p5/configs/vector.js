import colors from '../../styles/colors'
import { getSize } from '../../utils/sizeUtils'

const mainSketchConfigs = {
  scale: getSize({ l: 1.15, xxl: 2.5 }),
  tracking: 4,
  leading: 70,
  easing: 'easeOutQuad',
  maxStretch: 18.5,
  glyphColor: colors.homeSketch,
  linkColor: colors.homeSketch,
}

const lowerWeight = getSize({ l: 6, xxl: 10 })
export const homeIconScales = { l: 0.75, xxl: 1.15 }
const homeIconWeight = getSize({ l: 4, xxl: 6 })

const configs = {
  MAIN_UPPER: {
    ...mainSketchConfigs,
    glyphWeight: getSize({ l: 4, xxl: 7 }),
    linkWeight: getSize({ l: 3, xxl: 5 }),
    pointSize: getSize({ l: 8, xxl: 16 }),
    pointColor: colors.homeSketch,
    pointFill: colors.homeSketch,
    drawingSequence: ['drawLinks', 'drawPoints'],
  },
  MAIN_LOWER: {
    ...mainSketchConfigs,
    glyphWeight: lowerWeight,
    linkWeight: lowerWeight,
    volumeColor: colors.homeSketch,
    drawingSequence: ['drawLinks', 'drawVolume'],
  },
  HOME_ICON: {
    scale: getSize(homeIconScales),
    position: ['LEFT', 'TOP'],
    glyphWeight: homeIconWeight,
    linkWeight: homeIconWeight,
    glyphColor: colors.homeIcon,
    linkColor: colors.homeIcon,
    volumeColor: colors.homeIcon,
    easing: 'easeOutCubic',
    drawingSequence: ['drawLinks', 'drawVolume'],
    maxStretch: 8,
  },
  VECTOR_STRING_TRANSLATE: {
    glyphWeight: getSize({ l: 2, xxl: 3 }),
    linkWeight: getSize({ l: 2, xxl: 3 }),
    pointSize: getSize({ l: 7, xxl: 10 }),
    pointColor: colors.vectorStringSketch,
    pointFill: colors.vectorStringSketch,
    glyphColor: colors.vectorStringSketch,
    linkColor: colors.vectorStringSketch,
    drawingSequence: ['drawLinks', 'drawPoints'],
    mapFunction: function (stillVector, mouseVector) {
      const distVector = mouseVector.sub(this.mouseOrigin)
      const segmentation = 20
      const segmentSize = Math.PI * 2 / segmentation
      const segmentedHeading = Math.floor(distVector.heading() / segmentSize) * segmentSize
      distVector
        .setHeading(segmentedHeading)
        .setMag(this.maxStretch)
        .add(stillVector)
      return distVector
    }
  }
}

export default configs