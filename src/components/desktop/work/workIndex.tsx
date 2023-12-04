import { Suspense, useRef, useState } from 'react'
import Masonry from '@mui/lab/Masonry'
import { useMediaQuery } from '@uidotdev/usehooks'
import styled from 'styled-components'
import useCanvas from '../../../hooks/useCanvas'
import usePreloadQueue from '../../../hooks/usePreloadQueue'
import useSidebar from '../../../hooks/useSidebar'
import drawWorkSketch from '../../../p5/sketches/desktop/drawWorkSketch'
import { domSizes } from '../../../styles/sizes'
import { minQueries } from '../../../utils/queryUtil'
import MainContainer from '../../common/styled/mainContainer'
import { Device } from '../../../utils/breakptTypes'
import { getParsedWorkData } from '../../../utils/commonUtils'
import WorkIndexSidebar from './workIndexSideBar'
import WorkThumbnail from './workThumbnail'

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
    highlighted={highlighted}
    sidebarRef={sidebarRef}
    handleHover={handleHover} />, [highlighted])

  const isExtraLargeDevice = useMediaQuery(minQueries.xl)
  const columns = isExtraLargeDevice ? 3 : 2

  return (
    <ThumbnailContainer $columns={columns}>
      <Suspense>
        <Masonry columns={columns}>
          {getParsedWorkData(Device.Desktop)
            .map(project => project.listed && <WorkThumbnail
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
    `calc(100% / ${$columns} - ${domSizes.desktop.workIndex.thumbnail.gap.css} * 2)`};
    margin: ${domSizes.desktop.workIndex.thumbnail.gap.css};
  }
`

export default WorkIndex