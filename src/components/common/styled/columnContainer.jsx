import { styled } from 'styled-components'
import mixins from '../../../styles/mixins'
import { sizes } from '../../../styles/sizes'

const ColumnContainer = styled.div`
  ${mixins.innerMargin(sizes.workPage.media.gap.css)}
`

export default ColumnContainer