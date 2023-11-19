import WorkImg from '../../common/media/workImg'
import RowContainer from '../../common/rowContainer'
import { WorkPageMobileContentProps } from '../workPageTypes'


const PageObjectBulbMobile = ({ WorkInfo, Description }: WorkPageMobileContentProps) => {
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
        <WorkImg src='4.webp' />
        <WorkImg src='3.webp' />
      </RowContainer>
      <RowContainer>
        <WorkImg src='6.webp' />
      </RowContainer>
      <RowContainer>
        <WorkImg src='7.webp' />
      </RowContainer>
      <RowContainer>
        <WorkImg src='s1.webp' />
        <WorkImg src='s2.webp' />
      </RowContainer>
      <RowContainer>
        <WorkImg src='s4.webp' />
        <WorkImg src='s6.webp' />
      </RowContainer>
      <RowContainer>
        <WorkImg src='s3.webp' />
        <WorkImg src='s9.webp' />
      </RowContainer>
      <RowContainer>
        <WorkImg src='8.webp' />
      </RowContainer>
      <RowContainer>
        <WorkImg src='9.webp' />
      </RowContainer>
      <RowContainer>
        <WorkImg src='10.webp' />
      </RowContainer>
      <RowContainer>
        <WorkImg src='11.webp' />
      </RowContainer>
    </>
  )
}


export default PageObjectBulbMobile