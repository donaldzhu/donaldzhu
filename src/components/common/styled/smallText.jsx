import { styled } from 'styled-components'
import Text from './text'
import { fontSizes } from '../../../styles/fonts'
import sizes from '../../../styles/sizes'

const SmallText = styled(Text)`
  font-size: ${fontSizes.workDescription};
  max-width: ${sizes.workDescriptionMaxWidth};
  line-height: ${fontSizes.smallTextLineHeight};
  
  b {
    font-size: 1em;
    letter-spacing: inherit;
  }
`

export default SmallText