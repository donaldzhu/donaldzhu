import WorkImg from '../../common/media/workImg'
import WorkImgGroup from '../../common/media/workImgGroup'
import WorkVid from '../../common/media/workVid'
import RowContainer from '../../common/rowContainer'

const PageThePoorImage = () => {
  return (
    <>
      <RowContainer>
        <WorkImg src='1.webp' />
      </RowContainer>
      <RowContainer>
        <WorkVid src='1.webm' />
      </RowContainer>
      <WorkImgGroup grid={[2, 3]} prefix='screenshots' />
    </>
  )
}


export default PageThePoorImage