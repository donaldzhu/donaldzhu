import styled from 'styled-components'
import { fontSizes } from '../../../styles/fonts'
import { sizes } from '../../../styles/sizes'

const ParagraphContainer = styled.div`
  font-size: ${fontSizes.workDescription};
  max-width: ${sizes.workPage.sidebar.description.maxWidth.css};
`

export default ParagraphContainer