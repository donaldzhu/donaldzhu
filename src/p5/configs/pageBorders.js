import { sizes } from '../../styles/sizes'
import { responsiveValue } from '../../utils/styleUtils'

export const dashLineConfigs = {
  cursorSize: () => responsiveValue({ l: 40, xxl: 65 }),
  lineWeight: () => responsiveValue({ l: 3, xxl: 5 }),
  lineDash: () => Array(2).fill(responsiveValue({ l: 5, xxl: 8 }))
}

