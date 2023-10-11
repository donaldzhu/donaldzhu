import { styled } from 'styled-components'
import Text from './text'
import { fontSizes, fontLineHeights } from '../../../styles/fonts'
import { sizes } from '../../../styles/sizes'

const SmallText = styled(Text)`
  font-size: ${fontSizes.smallText.css};
  max-width: ${sizes.workPage.sidebar.description.maxWidth.css};
  line-height: ${fontLineHeights.smallText};

  b {
    font-size: 1em;
    letter-spacing: inherit;
  }
`

export default SmallText