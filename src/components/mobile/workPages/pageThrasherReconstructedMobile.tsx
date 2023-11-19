import WorkImg from '../../common/media/workImg'
import WorkVid from '../../common/media/workVid'
import RowContainer from '../../common/rowContainer'
import { WorkPageMobileContentProps } from '../workPageTypes'

const PageThrasherReconstructedMobile = ({ WorkInfo, Description }: WorkPageMobileContentProps) => {
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
        <WorkVid src='1.mp4' />
      </RowContainer>
      <RowContainer>
        <WorkVid src='2.mp4' />
      </RowContainer>
      <RowContainer>
        <WorkVid src='3.mp4' />
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
      <RowContainer>
        <WorkImg src='9.webp' />
      </RowContainer>
      <RowContainer>
        <WorkImg src='10.webp' />
      </RowContainer>
    </>
  )
}

export default PageThrasherReconstructedMobile