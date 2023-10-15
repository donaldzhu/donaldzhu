import styled from 'styled-components'
import { fontLineHeights, fontParams, fontSizes } from '../../../styles/fonts'
import mixins from '../../../styles/mixins'

const Text = styled.p`
  margin: 0;

  font-size: ${fontSizes.text.mono.css};
  font-weight: ${fontParams.semiLight};
  letter-spacing: -0.03em;
  line-height: ${fontLineHeights.text};

  a {
    ${mixins.underline()}
  }

  b {
    font-size: ${fontSizes.text.sans.css};
    letter-spacing: 0;
  }

  i {
    ${mixins.slant()}
    letter-spacing: -0.02em;
  }
`

export default Text