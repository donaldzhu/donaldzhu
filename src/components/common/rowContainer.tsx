import _ from 'lodash'
import { forwardRef, type ReactNode } from 'react'
import styled from 'styled-components'
import mixins from '../../styles/mixins'
import { domSizes } from '../../styles/sizes'
import { arrayify, validateString } from '../../utils/commonUtils'
import { desktopQuery, mobileQuery } from '../../utils/queryUtil'
import { Device } from '../../utils/breakptTypes'
import ToolTip from './toolTip'

interface RowContainerProps {
  className?: string
  cols?: number[]
  toolTip?: ReactNode
  children?: ReactNode
}

interface StyledRowContainerProps {
  $cols: number[]
}

const RowContainer = forwardRef<HTMLDivElement, RowContainerProps>(function RowContainer({
  className,
  cols,
  children,
  toolTip
}, ref) {
  const childrenLength = arrayify(children).flat().length
  return (
    <Container className={className} ref={ref}>
      {toolTip && <ToolTip>{toolTip}</ToolTip>}
      <Row
        $cols={cols ?? Array(childrenLength).fill(1)}>
        {children}
      </Row>
    </Container>
  )
})

const Container = styled.div`
  ${mixins.flex('center', 'center')};
`

const getChildrenStyles = (device: Device) => ({ $cols }: StyledRowContainerProps) =>
  validateString($cols, $cols.map((col, i) => `
    >:nth-child(${i + 1}){
      width: calc((100% - ${domSizes[device].workPage.media.gap.css} * ${$cols.length - 1}) * ${col / _.sum($cols)});
    }
  `).join(''))


const childrenMargin = (device: Device) => mixins.innerMargin(domSizes[device].workPage.media.gap.css, 'left')

const Row = styled.div<StyledRowContainerProps>`
  display: flex;
  height: 100%;

  @media ${desktopQuery} {
    width: 100%;
    ${getChildrenStyles(Device.Desktop)}
    ${childrenMargin(Device.Desktop)}
  }

  @media ${mobileQuery} {
    width: 96%;
    ${getChildrenStyles(Device.Mobile)}
    ${childrenMargin(Device.Mobile)}
  }

  img, video {
    height: 100%;
  }
`

export default RowContainer