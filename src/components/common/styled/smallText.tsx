import styled from 'styled-components'
import { fontFamilies, fontLineHeights, fontParams, fontSizes } from '../../../styles/fonts'
import { maxQueries, minQueries } from '../../../utils/queryUtil'
import { domSizes } from '../../../styles/sizes'
import Text from './text'

const SmallText = styled(Text)`
  font-size: ${fontSizes.desktop.smallText.css};
  line-height: ${fontLineHeights.smallText};

  b {
    font-size: inherit;
    font-family: ${fontFamilies.monoFont};
  }

  @media ${maxQueries.l} {
    font-size: ${fontSizes.mobile.smallText.css};
    font-weight: normal;
  }

  @media ${minQueries.l} {
    max-width: ${domSizes.desktop.workPage.sidebar.description.maxWidth.css};
  }
`

export default SmallText