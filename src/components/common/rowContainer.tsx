import _ from 'lodash'
import { forwardRef, ReactNode } from 'react'
import styled from 'styled-components'
import mixins from '../../styles/mixins'
import { domSizes } from '../../styles/sizes'
import { arrayify, validateString } from '../../utils/commonUtils'
import { maxQueries, minQueries } from '../../utils/queryUtil'
import ToolTip from './toolTip'

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

const RowContainer = forwardRef<HTMLDivElement, RowContainerProps>(({
  className,
  cols,
  width,
  children,
  toolTip
}, ref) => {
  const childrenLength = arrayify(children).flat().length
  return (
    <Container className={className} ref={ref}>
      {toolTip && <ToolTip>{toolTip}</ToolTip>}
      <Row
        $width={width}
        $cols={cols ?? Array(childrenLength).fill(1)}>
        {children}
      </Row>
    </Container>
  )
})

const Container = styled.div`
  ${mixins.flex('center', 'center')};
`

const Row = styled.div<StyledRowContainerProps>`
  display: flex;

  @media ${maxQueries.l} {
    width: 96%;
    ${({ $cols }) =>
    validateString($cols, $cols.map((col, i) => `
      >:nth-child(${i + 1}){
        width: calc((100% - ${domSizes.mobile.workPage.media.gap.css} * ${$cols.length - 1}) * ${col / _.sum($cols)});
      }`).join(''))}
    ${mixins.innerMargin(domSizes.mobile.workPage.media.gap.css, 'left')}
  }

  @media ${minQueries.l} {
    width: 100%;
    ${({ $cols }) =>
    validateString($cols, $cols.map((col, i) => `
      >:nth-child(${i + 1}){
        width: calc((100% - ${domSizes.desktop.workPage.media.gap.css} * ${$cols.length - 1}) * ${col / _.sum($cols)});
      }`).join(''))}
    ${mixins.innerMargin(domSizes.desktop.workPage.media.gap.css, 'left')}
  }

  > svg {
    width: 100%;
    height: 100%;
  }
`

export default RowContainer