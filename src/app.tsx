import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import styled from 'styled-components'
import Contact from './components/contact/contact'
import Home from './components/home/home'
import Page from './components/pageWrappers/page'
import PageMobile from './components/mobile/pageMobile'
import PageWithMainSketch from './components/pageWrappers/pageWithSketch'
import Process from './components/process/process'
import WorkIndex from './components/work/workIndex'
import WorkPage from './components/work/workPage'
import workData from './data/work/workData.json'
import workPages from './data/work/workPagesMap'
import colorConfig from './styles/colors'
import { fontFamilies, fontSizes } from './styles/fonts'
import mixins from './styles/mixins'
import { domSizes } from './styles/sizes'
import HomeMobile from './components/mobile/homeMobile'
import useCanAutoPlay from './hooks/useCanAutoPlay'
import { isBrowser, validateString } from './utils/commonUtils'
import { BrowserType } from './utils/utilTypes'
import useIsMobile from './hooks/useIsMobile'
import { minQueries } from './utils/queryUtil'
import PageMobileTemp from './components/mobileTemp/pageMobileTemp'
import HomeMobileTemp from './components/mobileTemp/homeMobileTemp'
import { LinkPath } from './data/links'
import PageWithSketchMobile from './components/mobile/pageWithSketchMobile'
import ProcessMobile from './components/mobile/processMobile'
import ContactMobile from './components/mobile/contactMobile'
import WorkIndexMobile from './components/mobile/workIndexMobile'

const App = () => {
  const isMobile = useIsMobile()
  const canAutoPlay = useCanAutoPlay()
  // const { vidLoadData, preloadManager } = usePreload(canAutoPlay)

  return (
    <StyledGlobal>
      <HashRouter>
        <Routes>
          {isMobile ?
            (process.env.NODE_ENV === 'production' ?
              <Route path='/' element={<PageMobileTemp canAutoPlay={canAutoPlay} />}>
                <Route path='' element={<HomeMobileTemp />} />
                <Route path='*' element={<Navigate to='/' replace />} />
              </Route> :
              <Route path='/' element={<PageMobile canAutoPlay={canAutoPlay} />}>
                <Route path='' element={<PageWithSketchMobile />}>
                  <Route path='' element={<HomeMobile />} />
                  <Route path={LinkPath.Contact} element={<ContactMobile />} />
                  <Route path={LinkPath.Process} element={<ProcessMobile />} />
                </Route>
                <Route path={LinkPath.Work} >
                  <Route path='' element={<WorkIndexMobile />} />
                </Route>
                <Route path='*' element={<Navigate to='/' replace />} />
              </Route>
            ) :
            <Route path='/' element={<Page canAutoPlay={canAutoPlay} />}>
              <Route path='' element={<PageWithMainSketch />}>
                <Route path='' element={<Home />} />
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
          }
        </Routes>
      </HashRouter>
    </StyledGlobal>
  )
}

const StyledGlobal = styled.main`
  ${mixins.flex()}

  height: fit-content;
  min-height: 100dvh;

  font-family: ${fontFamilies.monoFont};
  font-feature-settings: 'case';

  color: ${colorConfig.defaultText};

  > div {
    flex: none;
  }

  img {
    ${mixins.noSelect()}
  }

  * {
    &::selection {
      color: ${colorConfig.defaultTextSelectColor};
      background-color: ${colorConfig.defaultTextSelectBg};
    }
  }

  p {
    ${validateString(isBrowser(BrowserType.Firefox), 'hyphens: none;')}
  }

  b,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-family: ${fontFamilies.sansFont};
  }

  h1 {
    font-size: ${fontSizes.desktop.title.css};
    margin-bottom: 1em;
  }

  @media ${minQueries.l} {
    width: ${domSizes.desktop.app.width.css};
    a:hover {
      color: ${colorConfig.activeElem};
    }
  }
`



export default App