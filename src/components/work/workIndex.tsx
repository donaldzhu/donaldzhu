import Masonry from '@mui/lab/Masonry'
import { useMediaQuery } from '@uidotdev/usehooks'
import { Suspense, useRef, useState } from 'react'
import styled from 'styled-components'
import workData from '../../data/work/workData.json'
import useCanvas from '../../hooks/useCanvas'
import usePreloadQueue from '../../hooks/usePreloadQueue'
import useSidebar from '../../hooks/useSidebar'
import drawWorkSketch from '../../p5/sketches/drawWorkSketch'
import { domSizes } from '../../styles/sizes'
import { queries } from '../../utils/queryUtil'
import MainContainer from '../common/styled/mainContainer'
import WorkIndexSidebar from './workIndexSideBar'
import WorkThumbnail from './workThumbnail'

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

interface StyledWorkIndex {
  $columns: number
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

  useSidebar(<WorkIndexSidebar
    workData={workData}
    highlighted={highlighted}
    sidebarRef={sidebarRef}
    handleHover={handleHover} />, [highlighted])

  const isExtraLargeDevice = useMediaQuery(queries.xl)
  const columns = isExtraLargeDevice ? 3 : 2

  return (
    <ThumbnailContainer $columns={columns}>
      <Suspense>
        <Masonry columns={columns}>
          {workData.map(project => project.enabled && project.listed && <WorkThumbnail
            key={project.title}
            data={project}
            isHighlighted={highlighted === project.title}
            highlightedRef={rosterRef}
            handleHover={handleHover} />)}
        </Masonry>
      </Suspense>
    </ThumbnailContainer>
  )
}

const ThumbnailContainer = styled(MainContainer) <StyledWorkIndex>`
  a {
    width: ${({ $columns }) =>
    `calc(100% / ${$columns} - ${domSizes.workIndex.thumbnail.gap.css} * 2)`};
    margin: ${domSizes.workIndex.thumbnail.gap.css};
  }
`

export default WorkIndex