import colors from '../../styles/colors'
import { sketchSizes } from '../../styles/sizes'

const defaultConfig = {
  splitNum: 20,
  spring: 0.4,
  friction: 0.45,
}

const { primary, secondary } = sketchSizes.panto.brush
const config = {
  PRIMARY_BRUSH: {
    ...defaultConfig,
    fill: 175,
    sizeReductionFactor: 0.05,
    maxSize: primary.max,
    minSize: primary.min
  },
  SECONDARY_BRUSH: {
    ...defaultConfig,
    fill: colors.strokeSecondary,
    sizeReductionFactor: 0.4,
    maxSize: secondary.max,
    minSize: secondary.max,
  }
}

export default config