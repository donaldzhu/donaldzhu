import WorkImg from '../common/media/workImg'
import WorkImgGroup from '../common/media/workImgGroup'
import RowContainer from '../common/rowContainer'

const PageIVoted = () => {
  return (
    <>
      <RowContainer>
        <WorkImg src='1.webp' />
      </RowContainer>
      <RowContainer>
        <WorkImg src='2.webp' />
      </RowContainer>
      <RowContainer>
        <WorkImg src='3.webp' />
      </RowContainer>
      <RowContainer>
        <WorkImg src='4.webp' />
        <WorkImg src='5.webp' />
      </RowContainer>
      <RowContainer toolTip='The languages designed include (not in order): English, French, Arabic, Chinese, Farsi, German, Hindi, Italian, Japanese, Korean, Portuguese, Punjabi, Russian, Spanish, Tagalog, and Vietnamese.'>
        <WorkImg src='6.webp' />
      </RowContainer>
      <WorkImgGroup grid={[4, 4]} prefix='stickers' />
    </>
  )
}

export default PageIVoted