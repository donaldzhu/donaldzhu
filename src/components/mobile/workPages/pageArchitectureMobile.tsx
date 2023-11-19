import WorkImg from '../../common/media/workImg'
import RowContainer from '../../common/rowContainer'
import SmallText from '../../common/styled/smallText'
import TextContainer from '../../common/styled/textContainer'
import { WorkPageMobileContentProps } from '../workPageTypes'


const PageArchitecture = ({ WorkInfo, Description }: WorkPageMobileContentProps) => {
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
    </>
  )
}

export default PageArchitecture