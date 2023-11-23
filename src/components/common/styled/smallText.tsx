import styled from 'styled-components'
import { fontFamilies, fontLineHeights, fontParams, fontSizes } from '../../../styles/fonts'
import { desktopQuery, mobileQuery } from '../../../utils/queryUtil'
import { domSizes } from '../../../styles/sizes'
import Text from './text'

// needed to overwrite Text style
const boldStyle = `
  b {
    font-size: inherit;
    font-family: ${fontFamilies.monoFont};
    font-weight: ${fontParams.bold};
  }
`

const SmallText = styled(Text)`
  font-size: ${fontSizes.desktop.smallText.css};
  line-height: ${fontLineHeights.smallText};

  @media ${mobileQuery} {
    font-size: ${fontSizes.mobile.smallText.css};
    font-weight: normal;
    ${boldStyle}
  }

  @media ${desktopQuery} {
    max-width: ${domSizes.desktop.workPage.sidebar.description.maxWidth.css};
    ${boldStyle}
  }
`

export default SmallText