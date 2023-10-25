import WorkImg from '../common/media/workImg'
import WorkVid from '../common/media/workVid'
import RowContainer from '../common/rowContainer'

const PageGameStudies = () => {
  return (
    <>
      <RowContainer toolTip={
        <>
          <p>In ASCII fashion, these icons are mapped onto
            the image based on the brightness of the pixel.</p>
          <WorkImg src='1.webp' isToolTip />
        </>
      }>
        <WorkImg src='1.webp' />
        <WorkImg src='2.webp' />
      </RowContainer>
      <RowContainer>
        <WorkImg src='3.webp' />
        <WorkImg src='4.webp' />
      </RowContainer>
      <RowContainer>
        <WorkVid src='1.webm' />
      </RowContainer>
      <RowContainer>
        <WorkImg src='5.webp' width='87.5%' />
      </RowContainer>
    </>
  )
}

export default PageGameStudies