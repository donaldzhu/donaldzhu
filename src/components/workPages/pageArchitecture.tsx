import { percent } from '../../utils/sizeUtils'
import WorkImg from '../common/media/workImg'
import RowContainer from '../common/rowContainer'

const PageArchitecture = () => {
  const width = percent(90)
  return (
    <>
      <RowContainer toolTip={
        <>
          <p>Layers of type and images successively collaged together using wheatpaste. The wetness of the prints allows the process to be subtractive as well as additive.</p>
          <RowContainer>
            <WorkImg src='1.webp' isToolTip />
            <WorkImg src='2.webp' isToolTip />
          </RowContainer>
        </>
      }>
        <WorkImg src='1.webp' width={width} />
      </RowContainer>
      <RowContainer toolTip={
        <>
          <p>Applying gel medium on printed text turns the print into a flexible, translucent material, allowing it to be hand-manipulated.</p>
          <WorkImg src='3.webp' isToolTip />
          <WorkImg src='4.webp' isToolTip />
        </>
      }>
        <WorkImg src='2.webp' width={width} />
      </RowContainer>
      <RowContainer toolTip='Type made physically with clumps of duct tapes.'>
        <WorkImg src='3.webp' width={width} />
      </RowContainer>
    </>
  )
}


export default PageArchitecture