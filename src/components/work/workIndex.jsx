import { useRef, useState } from 'react'
import { styled } from 'styled-components'
import Masonry from '@mui/lab/Masonry'
import { useMediaQuery } from '@uidotdev/usehooks'
import WorkThumbnail from './workThumbnail'
import WorkSideBar from './workSidebar'
import MainContainer from '../common/styled/mainContainer'
import useSidebar from '../../hooks/useSidebar'
import useCanvas from '../../hooks/useCanvas'
import usePreloadQueue from '../../hooks/usePreloadQueue'
import drawWorkSketch from '../../p5/sketches/drawWorkSketch'
import sizes from '../../styles/sizes'
import queries from '../../utils/queryUtil'
import workData from '../../data/work/workData'
import usePortfolioQuery from '../../hooks/usePortfolioQuery'

const WorkIndex = () => {
  const [highlighted, setHighlighted] = useState()
  const sidebarRef = useRef(null)
  const rosterRef = useRef(null)

  const handleHover = projectTitle => setHighlighted(projectTitle)

  const setupDone = useCanvas(() =>
    drawWorkSketch({ sidebarRef, rosterRef }))

  usePreloadQueue(setupDone, preloadManager =>
    preloadManager.defaultPreload())

  const { portfolioData } = usePortfolioQuery()
  const filteredWorkData = portfolioData?.projects.map(projectId =>
    workData.find(work => work.id === projectId)
  ) || workData
  useSidebar(<WorkSideBar
    workData={filteredWorkData}
    highlighted={highlighted}
    sidebarRef={sidebarRef}
    handleHover={handleHover} />, [highlighted])

  const isExtraLargeDevice = useMediaQuery(queries.xl)
  const columns = isExtraLargeDevice ? 3 : 2

  return (
    <ThumbnailContainer $columns={columns}>
      <Masonry columns={columns}>
        {filteredWorkData.map(project => project.enabled && project.listed && <WorkThumbnail
          key={project.title}
          data={project}
          isHighlighted={highlighted === project.title}
          highlightedRef={rosterRef}
          handleHover={handleHover} />)}
      </Masonry>
    </ThumbnailContainer>
  )
}

const ThumbnailContainer = styled(MainContainer)`
  a {
    width: ${({ $columns }) => `calc(100% / ${$columns} - ${sizes.workThumbnailGap} * 2)`};
    margin: ${sizes.workThumbnailGap};
  }
`

export default WorkIndex