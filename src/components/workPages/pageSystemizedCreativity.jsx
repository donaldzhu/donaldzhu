import RowContainer from '../common/rowContainer'
import WorkImg from '../common/media/workImg'

const PageSystemizedCreativity = () => {
  return (
    <>
      <RowContainer>
        <WorkImg src='1.webp' />
      </RowContainer>
      <RowContainer cols={[2, 3]}>
        <WorkImg src='2.webp' />
        <WorkImg src='3.webp' />
      </RowContainer>
      <RowContainer>
        <WorkImg src='4.webp' />
      </RowContainer>
      <RowContainer>
        <WorkImg src='5.webp' />
      </RowContainer>
      <RowContainer>
        <WorkImg src='6.webp' />
      </RowContainer>
      <RowContainer>
        <WorkImg src='7.webp' />
      </RowContainer>
      <RowContainer>
        <WorkImg src='8.webp' />
      </RowContainer>

    </>
  )
}


export default PageSystemizedCreativity