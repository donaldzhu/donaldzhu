import { WorkPageMobileProps } from '../workPageTypes'
import RowContainer from '../../common/rowContainer'
import WorkImg from '../../common/media/workImg'

const PageSystemizedCreativityMobile = ({ Description }: WorkPageMobileProps) => {
  return (
    <>
      <RowContainer>
        <WorkImg src='1.webp' />
      </RowContainer>
      <Description />
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

export default PageSystemizedCreativityMobile