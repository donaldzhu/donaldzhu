import { styled } from 'styled-components'
import mixins from '../../../styles/mixins'
import sizes from '../../../styles/sizes'

const ColumnContainer = styled.div`
  ${mixins.innerMargin(sizes.workPageGridGap)}
`

export default ColumnContainer