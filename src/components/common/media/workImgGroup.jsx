import RowContainer from '../rowContainer'
import WorkImg from './workImg'
import { joinPaths, repeatMap } from '../../../utils/commonUtils.ts'

const WorkImgGroup = ({ grid, toolTip, prefix, props }) => {
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