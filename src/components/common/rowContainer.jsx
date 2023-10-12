import { forwardRef } from 'react'
import { styled } from 'styled-components'
import _ from 'lodash'
import ToolTip from './toolTip'
import { arrayify, validateString } from '../../utils/commonUtils.ts'
import { domSizes } from '../../styles/sizes'
import mixins from '../../styles/mixins'


const RowContainer = forwardRef(function RowContainer({ className, cols, width, children, toolTip }, ref) {
  children = arrayify(children)
  return (
    <Container className={className} ref={ref}>
      {toolTip && <ToolTip>{toolTip}</ToolTip>}
      <Row
        $width={width}
        $cols={cols || Array(children.flat().length).fill(1)}>
        {children}
      </Row>
    </Container>
  )
})

const Container = styled.div`
  ${mixins.flex('center', 'initial')};
`

const Row = styled.div`
  display: flex;
  width: 100%;

  ${({ $cols }) =>
    validateString($cols, $cols.map((col, i) => `
      >:nth-child(${i + 1}){
        width: calc((100% - ${domSizes.workPage.media.gap.css} * ${$cols.length - 1}) * ${col / _.sum($cols)});
      }`).join(''))
  }

  ${mixins.innerMargin(domSizes.workPage.media.gap.css, 'left')}

  > svg {
    width: 100%;
    height: 100%;
  }
`

export default RowContainer