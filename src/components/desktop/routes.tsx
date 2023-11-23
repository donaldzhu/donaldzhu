import { Navigate, Route, Routes } from 'react-router-dom'
import { LinkPath } from '../../data/links'
import workPages from '../../data/work/workPageMaps.ts/desktopMap'
import workData from '../../data/work/workData.json'
import Page from './pageWrappers/page'
import PageWithMainSketch from './pageWrappers/pageWithSketch'
import Home from './home/home'
import Contact from './contact/contact'
import Process from './process/process'
import WorkIndex from './work/workIndex'
import WorkPage from './work/workPage'
import type { RouteProps } from '../routeTypes'

const DesktopRoutes = ({ canAutoPlay }: RouteProps) => {
  return (
    <Routes>
      <Route path='/' element={<Page canAutoPlay={canAutoPlay} />}>
        <Route path='' element={<PageWithMainSketch />}>
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
        </Route >
        <Route path='*' element={<Navigate to='/' replace />} />
      </Route>
    </Routes>
  )
}

export default DesktopRoutes