import WorkImg from '../../common/media/workImg'
import RowContainer from '../../common/rowContainer'
import type { WorkPageContentProps } from '../work/workPageTypes'


const PageArchitecture = ({ WorkInfo, Description }: WorkPageContentProps) => {
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