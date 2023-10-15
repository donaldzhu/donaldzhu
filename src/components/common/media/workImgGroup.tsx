import RowContainer from '../rowContainer'
import WorkImg from './workImg'
import { joinPaths, repeatMap } from '../../../utils/commonUtils'
import { ReactNode } from 'react'
import { WorkImgProps } from './mediaTypes'

interface WorkImgGroupProps {
  grid: number[]
  toolTip?: ReactNode
  prefix: string
  props?: Omit<WorkImgProps, 'src'>
}

const WorkImgGroup = ({ grid, toolTip, prefix, props }: WorkImgGroupProps) => {
  const [col, row] = grid
  return repeatMap(row, i =>
    <RowContainer key={i} toolTip={!i && toolTip}>
      {repeatMap(col, ii =>
        <WorkImg
          src={joinPaths(prefix, `${i + ii + 1}.webp`)}
          {...props}
          key={ii} />)}
    </RowContainer>
  )
}

export default WorkImgGroup