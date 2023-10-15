import colors from '../../styles/colors'
import { getSize } from '../../utils/sizeUtils'
import { DEFAULT_SETTING, XPosition, YPosition } from '../helpers/vector/constants'
import { Easing, VectorDrawMethod, VectorSetting } from '../helpers/vector/vectorTypes'

const mainSketchConfigs = {
  scale: getSize({ l: 1.15, xxl: 2.5 }),
  tracking: 4,
  leading: 70,
  easing: Easing.EaseOutQuad,
  maxStretch: 18.5,
  glyphColor: colors.homeSketch,
  linkColor: colors.homeSketch,
}

const lowerWeight = getSize({ l: 6, xxl: 10 })
export const homeIconScales = { l: 0.75, xxl: 1.15 }
const homeIconWeight = getSize({ l: 4, xxl: 6 })

const configs: Record<string, Partial<VectorSetting>> = {
  MAIN_UPPER: {
    ...mainSketchConfigs,
    glyphWeight: getSize({ l: 4, xxl: 7 }),
    linkWeight: getSize({ l: 3, xxl: 5 }),
    pointSize: getSize({ l: 8, xxl: 16 }),
    pointColor: colors.homeSketch,
    pointFill: colors.homeSketch,
    drawingSequence: [VectorDrawMethod.DrawLinks, VectorDrawMethod.DrawPoints],
  },
  MAIN_LOWER: {
    ...mainSketchConfigs,
    glyphWeight: lowerWeight,
    linkWeight: lowerWeight,
    volumeColor: colors.homeSketch,
    drawingSequence: [VectorDrawMethod.DrawLinks, VectorDrawMethod.DrawVolume],
  },
  HOME_ICON: {
    scale: getSize(homeIconScales),
    position: [XPosition.Left, YPosition.Top],
    glyphWeight: homeIconWeight,
    linkWeight: homeIconWeight,
    glyphColor: colors.homeIcon,
    linkColor: colors.homeIcon,
    volumeColor: colors.homeIcon,
    easing: Easing.EaseOutCubic,
    drawingSequence: [VectorDrawMethod.DrawLinks, VectorDrawMethod.DrawVolume],
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
    drawingSequence: [VectorDrawMethod.DrawLinks, VectorDrawMethod.DrawPoints],
    mapFunction: function (stillVector, mouseVector) {
      const distVector = mouseVector.sub(this.mouseOrigin || stillVector)
      const segmentation = 20
      const segmentSize = Math.PI * 2 / segmentation
      const segmentedHeading = Math.floor(distVector.heading() / segmentSize) * segmentSize
      distVector
        .setHeading(segmentedHeading)
        .setMag(this.maxStretch || DEFAULT_SETTING.maxStretch)
        .add(stillVector)
      return distVector
    }
  }
}

export default configs