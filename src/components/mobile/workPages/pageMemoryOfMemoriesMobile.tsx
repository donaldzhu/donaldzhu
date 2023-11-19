import { WorkPageMobileContentProps } from '../workPageTypes'
import RowContainer from '../../common/rowContainer'
import WorkImg from '../../common/media/workImg'


const PageMemoryOfMemoriesMobile = ({ WorkInfo, Description }: WorkPageMobileContentProps) => {
  return (
    <>
      <RowContainer>
        <WorkImg src='1.webp' />
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
      <RowContainer>
        <WorkImg src='8.webp' />
        <WorkImg src='9.webp' />
      </RowContainer>
      <RowContainer>
        <WorkImg src='10.webp' />
        <WorkImg src='11.webp' />
      </RowContainer>
      <RowContainer>
        <WorkImg src='7.webp' />
      </RowContainer>
      <RowContainer>
        <WorkImg src='12.webp' />
      </RowContainer>
      <RowContainer>
        <WorkImg src='13.webp' />
        <WorkImg src='14.webp' />
      </RowContainer>
      <RowContainer>
        <WorkImg src='15.webp' />
      </RowContainer>
      <RowContainer>
        <WorkImg src='16.webp' />
      </RowContainer>
    </>
  )
}


export default PageMemoryOfMemoriesMobile