import styled from 'styled-components'
import { fontLineHeights, fontSizes } from '../../../styles/fonts'
import { domSizes } from '../../../styles/sizes'
import Text from './text'

const SmallText = styled(Text)`
  font-size: ${fontSizes.desktop.smallText.css};
  max-width: ${domSizes.desktop.workPage.sidebar.description.maxWidth.css};
  line-height: ${fontLineHeights.smallText};

  b {
    font-size: 1em;
    letter-spacing: inherit;
  }
`

export default SmallText