import { responsiveValue } from '../../utils/styleUtils'
import colors from '../../styles/colors'

const defaultConfig = {
  splitNum: 20,
  spring: 0.4,
  friction: 0.45,
}

const config = {
  PRIMARY_BRUSH: {
    ...defaultConfig,
    fill: 175,
    sizeReductionFactor: 0.05,
    maxSize: () => responsiveValue({ l: 4, xxl: 7 }),
    minSize: () => responsiveValue({ l: 3, xxl: 5 })
  },
  SECONDARY_BRUSH: {
    ...defaultConfig,
    fill: colors.strokeSecondary,
    sizeReductionFactor: 0.4,
    maxSize: () => responsiveValue({ l: 10, xxl: 28 }),
    minSize: () => responsiveValue({ l: 4, xxl: 8 }),
    rotation: Math.PI / 4
  }
}

export default config