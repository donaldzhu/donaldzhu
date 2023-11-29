import { Navigate, Route, Routes } from 'react-router-dom'
import { LinkPath } from '../../data/links'
import workData from '../../data/work/workData.json'
import workPages from '../../data/work/workPageMaps.ts/mobileMap'
import Page from './pageWrappers/page'
import PageWithSketch from './pageWrappers/pageWithSketch'
import Home from './home'
import Contact from './contact'
import Process from './process'
import WorkIndex from './work/workIndex'
import WorkPage from './work/workPage'
import type { RouteProps } from '../routeTypes'


const MobileRoutes = ({ mediaSettings }: RouteProps) => {
  const { canAutoPlay } = mediaSettings
  return (
    <Routes>
      <Route path='/' element={<Page canAutoPlay={canAutoPlay} />}>
        <Route path='' element={<PageWithSketch />}>
          <Route index element={<Home />} />
          <Route path={LinkPath.Contact} element={<Contact />} />
          <Route path={LinkPath.Process} element={<Process />} />
        </Route>
        <Route path={LinkPath.Work} >
          <Route path='' element={<WorkIndex />} />
          {workData.map(page => page.enabled &&
            <Route key={page.id} path={page.id} element={
              <WorkPage
                data={page}
                Content={workPages[page.id]} />} />)}
        </Route>
        <Route path='*' element={<Navigate to='/' replace />} />
      </Route>
    </Routes>
  )
}

export default MobileRoutes