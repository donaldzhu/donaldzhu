import { Routes, Route, Navigate, HashRouter } from 'react-router-dom'
import { styled } from 'styled-components'
import { useMediaQuery } from '@uidotdev/usehooks'
import MobileBlocker from './components/mobileBlocker'
import Page from './components/pageWrappers/page'
import Home from './components/home/home'
import Contact from './components/contact/contact'
import PageWithMainSketch from './components/pageWrappers/pageWithSketch'
import Process from './components/process/process'
import WorkIndex from './components/work/workIndex'
import WorkPage from './components/work/workPage'
import { queries } from './utils/queryUtil'
import { sizes } from './styles/sizes'
import colorConfig from './styles/colors'
import { fontFamilies, fontSizes } from './styles/fonts'
import mixins from './styles/mixins'
import workData from './data/work/workData'
import workPages from './data/work/workPagesMap'

const App = () => {
  const isMobile = !useMediaQuery(queries.l)
  return (
    <StyledGlobal>
      <HashRouter>
        <Routes>
          <Route path='/' element={isMobile ? <MobileBlocker /> : <Page />}>
            <Route path='' element={<PageWithMainSketch />}>
              <Route path='' element={<Home />} />
              <Route path='contact' element={<Contact />} />
              <Route path='process' element={<Process />} />
            </Route>
            <Route path='work' >
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
      </HashRouter>
    </StyledGlobal>
  )
}

const StyledGlobal = styled.main`
  ${mixins.flex()}

  width: ${sizes.app.width.css};
  height: fit-content;

  font-family: ${fontFamilies.monoFont};
  font-feature-settings: 'case';

  color: ${colorConfig.defaultText};

  > div {
    flex: none;
    height: 100%;
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
    font-size: ${fontSizes.title};
    margin-bottom: 1em;
  }
`



export default App