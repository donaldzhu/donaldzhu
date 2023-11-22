import { percent } from '../../../utils/sizeUtils'
import WorkImg from '../../common/media/workImg'
import WorkVid from '../../common/media/workVid'
import RowContainer from '../../common/rowContainer'


const PageThrasherReconstructed = () => {
  const videoWidth = percent(70)
  return (
    <>
      <RowContainer>
        <WorkImg src='1.webp' />
      </RowContainer>
      <RowContainer>
        <WorkImg src='2.webp' />
        <WorkImg src='3.webp' />
      </RowContainer>
      <RowContainer>
        <WorkImg src='4.webp' />
        <WorkImg src='5.webp' />
      </RowContainer>
      <RowContainer>
        <WorkVid src='1.webm' width={videoWidth} />
      </RowContainer>
      <RowContainer>
        <WorkVid src='2.webm' width={videoWidth} />
      </RowContainer>
      <RowContainer>
        <WorkVid src='3.webm' width={videoWidth} />
      </RowContainer>
      <RowContainer>
        <WorkImg src='6.webp' />
        <WorkImg src='7.webp' />
      </RowContainer>
      <RowContainer>
        <WorkImg src='8.webp' />
        <WorkImg src='9.webp' />
        <WorkImg src='10.webp' />
      </RowContainer>
    </>
  )
}

export default PageThrasherReconstructed