import WorkImg from '../../common/media/workImg'
import WorkImgGroup from '../../common/media/workImgGroup'
import RowContainer from '../../common/rowContainer'
import type { WorkPageContentProps } from '../work/workPageTypes'

const PageIVoted = ({ WorkInfo, Description }: WorkPageContentProps) => {
  return (
    <>
      <RowContainer>
        <WorkImg src='mobile-1.webp' />
      </RowContainer>
      <WorkInfo />
      <Description />
      <RowContainer>
        <WorkImg src='2.webp' />
      </RowContainer>
      <RowContainer>
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
      <WorkImgGroup grid={[2, 8]} prefix='stickers' />
    </>
  )
}

export default PageIVoted