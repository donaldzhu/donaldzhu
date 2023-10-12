import { styled } from 'styled-components'
import mixins from '../../../styles/mixins'
import { domSizes } from '../../../styles/sizes'

const ColumnContainer = styled.div`
  ${mixins.innerMargin(domSizes.workPage.media.gap.css)}
`

export default ColumnContainer