import { ReactNode, forwardRef } from 'react'
import { styled } from 'styled-components'
import _ from 'lodash'
import ToolTip from './toolTip'
import { arrayify, validateString } from '../../utils/commonUtils'
import { domSizes } from '../../styles/sizes'
import mixins from '../../styles/mixins'

interface RowContainerProps {
  className?: string
  cols?: number[]
  width?: string
  toolTip?: ReactNode
  children?: ReactNode
}

interface StyledRowContainerProps {
  $width: string | undefined
  $cols: number[]
}

const RowContainer = forwardRef<HTMLDivElement, RowContainerProps>(function RowContainer({ className, cols, width, children, toolTip }, ref) {
  const childrenLength = arrayify(children).flat().length
  return (
    <Container className={className} ref={ref}>
      {toolTip && <ToolTip>{toolTip}</ToolTip>}
      <Row
        $width={width}
        $cols={cols || Array(childrenLength).fill(1)}>
        {children}
      </Row>
    </Container>
  )
})

const Container = styled.div`
  ${mixins.flex('center', 'initial')};
`

const Row = styled.div<StyledRowContainerProps>`
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