import { forwardRef } from 'react'
import { styled } from 'styled-components'
import _ from 'lodash'
import ToolTip from './toolTip'
import { arrayify } from '../../utils/commonUtils.ts'
import sizes from '../../styles/sizes'
import mixins from '../../styles/mixins'


const RowContainer = forwardRef(({ className, cols, width, children, toolTip }, ref) => {
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
    $cols ? $cols.map((col, i) => `
    >:nth-child(${i + 1}){
      width: calc((100% - ${sizes.workPageGridGap} * ${$cols.length - 1}) * ${col / _.sum($cols)});
    }`).join('') : ''
  }

  ${mixins.innerMargin(sizes.workPageGridGap, 'left')}

  > svg {
    width: 100%;
    height: 100%;
  }
`

export default RowContainer