import styled from 'styled-components'
import { fontLineHeights, fontParams, fontSizes } from '../../../styles/fonts'
import mixins from '../../../styles/mixins'
import { maxQueries, minQueries } from '../../../utils/queryUtil'

const Text = styled.p`
  margin: 0;

  @media ${maxQueries.l} {
    font-size: ${fontSizes.mobile.text.mono.css};
  }
  @media ${minQueries.l} {
    font-size: ${fontSizes.desktop.text.mono.css};
  }
  font-weight: ${fontParams.semiLight};
  letter-spacing: -0.03em;
  line-height: ${fontLineHeights.text};

  a {
    ${mixins.underline()}
  }

  b {
    font-size: ${fontSizes.mobile.text.sans.css};
    @media ${minQueries.l} {
      font-size: ${fontSizes.desktop.text.sans.css};
    }
    letter-spacing: 0;
  }

  i {
    ${mixins.slant()}
    letter-spacing: -0.02em;
  }
`

export default Text