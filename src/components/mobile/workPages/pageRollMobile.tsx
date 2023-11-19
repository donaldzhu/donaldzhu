import WorkImg from '../../common/media/workImg'
import RowContainer from '../../common/rowContainer'
import TextContainer from '../../common/styled/textContainer'
import { WorkPageMobileContentProps } from '../workPageTypes'


const PageRollMobile = ({ WorkInfo, Description }: WorkPageMobileContentProps) => {
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
        <WorkImg src='7.webp' />
      </RowContainer>
      <RowContainer>
        <WorkImg src='8.webp' />
      </RowContainer>
    </>
  )
}


export default PageRollMobile