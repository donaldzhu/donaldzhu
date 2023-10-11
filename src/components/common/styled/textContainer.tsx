import { styled } from 'styled-components'
import mixins from '../../../styles/mixins'
import { sizes } from '../../../styles/sizes'
import { fontParams } from '../../../styles/fonts'

const TextContainer = styled.div`
  ${mixins
    .chain()
    .fontVar({ MONO: fontParams.monoVariable })
    .innerMargin(sizes.text.innerMargin.css)}

  &>:last-child {
    padding-bottom: ${sizes.sidebar.padding.vert.css};
  }
`

export default TextContainer