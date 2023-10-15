import RowContainer from '../common/rowContainer'
import WorkImg from '../common/media/workImg'
import WorkVid from '../common/media/workVid'

const PageVectorSpinStroke = () => {
  return (
    <>
      <RowContainer>
        <WorkImg src='1.webp' />
      </RowContainer>
      <RowContainer cols={[5, 3]}>
        <WorkImg src='2.webp' />
        <WorkImg src='3.webp' />
      </RowContainer>
      <RowContainer>
        <WorkImg src='4.webp' />
      </RowContainer>
      <RowContainer>
        <WorkImg src='5.webp' />
        <WorkImg src='6.webp' />
      </RowContainer>
      <RowContainer>
        <WorkImg src='7.webp' />
      </RowContainer>
      <RowContainer>
        <WorkVid src='1.webm' />
      </RowContainer>
      <RowContainer>
        <WorkImg src='8.webp' />
      </RowContainer>
      <RowContainer cols={[2, 3]} >
        <WorkImg src='9.webp' />
        <WorkImg src='10.webp' />
      </RowContainer>
      <RowContainer>
        <WorkImg src='11.webp' />
      </RowContainer>
    </>
  )
}

export default PageVectorSpinStroke