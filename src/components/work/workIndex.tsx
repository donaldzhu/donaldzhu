import { useRef, useState } from 'react'
import { styled } from 'styled-components'
import Masonry from '@mui/lab/Masonry'
import { useMediaQuery } from '@uidotdev/usehooks'
import WorkThumbnail from './workThumbnail'
import WorkIndexSidebar from './workIndexSideBar'
import MainContainer from '../common/styled/mainContainer'
import useSidebar from '../../hooks/useSidebar'
import useCanvas from '../../hooks/useCanvas'
import usePreloadQueue from '../../hooks/usePreloadQueue'
import drawWorkSketch from '../../p5/sketches/drawWorkSketch'
import { domSizes } from '../../styles/sizes'
import { queries } from '../../utils/queryUtil'
import workData from '../../data/work/workData.json'
import usePortfolioQuery from '../../hooks/usePortfolioQuery'
import { filterFalsy } from '../../utils/commonUtils'

export interface WorkDataInterface {
  id: string
  title: string
  abbr: string | null
  date: string
  tags: string[]
  medium: string[]
  animatedThumbnail: boolean
  enabled: boolean
  listed: boolean
}

const WorkIndex = () => {
  const [highlighted, setHighlighted] = useState<string>()
  const sidebarRef = useRef<HTMLAnchorElement>(null)
  const rosterRef = useRef<HTMLAnchorElement>(null)

  const handleHover = (projectTitle: string) => setHighlighted(projectTitle)

  const setupDone = useCanvas(() =>
    drawWorkSketch({ sidebarRef, rosterRef }))

  usePreloadQueue(setupDone, preloadManager =>
    preloadManager.defaultPreload())

  const { portfolioData } = usePortfolioQuery()
  const portfolioProjects = portfolioData ? filterFalsy(portfolioData?.projects
    .map(projectId => workData.find(work => work.id === projectId))) : []
  const filteredWorkData: WorkDataInterface[] = portfolioProjects.length ? portfolioProjects : workData

  useSidebar(<WorkIndexSidebar
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

const ThumbnailContainer = styled(MainContainer) <{ $columns: number }>`
  a {
    width: ${({ $columns }) => `calc(100% / ${$columns} - ${domSizes.workIndex.thumbnail.gap.css} * 2)`};
    margin: ${domSizes.workIndex.thumbnail.gap.css};
  }
`

export default WorkIndex