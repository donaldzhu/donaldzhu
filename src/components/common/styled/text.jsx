import { styled } from 'styled-components'
import { fontParams, fontSizes } from '../../../styles/fonts'
import mixins from '../../../styles/mixins'

const Text = styled.p`
  margin: 0;

  font-size: ${fontSizes.sidebarText};
  font-weight: ${fontParams.semiLight};
  letter-spacing: -0.03em;
  line-height: ${fontSizes.textLineHeight};

  a {
    ${mixins.underline()}
  }

  b {
    font-size: ${fontSizes.sidebarTextSans};
    letter-spacing: 0;
  }

  i {
    ${mixins.slant()}
    letter-spacing: -0.02em;
  }
`

export default Text