import styled from 'styled-components'
import mixins from '../../../styles/mixins'
import { domSizes } from '../../../styles/sizes'
import { maxQueries } from '../../../utils/queryUtil'

const TextContainer = styled.div`
  ${mixins
    .chain()
    .textMono()
    .innerMargin(domSizes.desktop.text.innerMargin.css)}

  &>:last-child {
    padding-bottom: ${domSizes.desktop.sidebar.padding.vert.css};
  }

  @media ${maxQueries.l} {
    ${mixins.mobileBody()}
    padding-top: ${domSizes.mobile.app.padding.top.css};
    &>:last-child {
      padding-bottom: ${domSizes.mobile.app.padding.bottom.css};
    }
  }
`

export default TextContainer