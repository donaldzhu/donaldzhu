import WorkImg from '../../common/media/workImg'
import WorkVid from '../../common/media/workVid'
import RowContainer from '../../common/rowContainer'
import SmallText from '../../common/styled/smallText'
import TextContainer from '../../common/styled/textContainer'
import type { WorkPageContentProps } from '../work/workPageTypes'

const PageGameStudies = ({ WorkInfo, Description }: WorkPageContentProps) => {
  return (
    <>
      <RowContainer>
        <WorkVid src='1.mp4' />
      </RowContainer>
      <WorkInfo />
      <Description />
      <RowContainer>
        <WorkImg src='1.webp' />
      </RowContainer>
      <TextContainer>
        <SmallText>
          In ASCII fashion, these icons are mapped onto
          the image based on the brightness of the pixel.
        </SmallText>
      </TextContainer>
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
    </>
  )
}

export default PageGameStudies