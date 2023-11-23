import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import styled from 'styled-components'
import colorConfig from './styles/colors'
import { fontFamilies, fontSizes } from './styles/fonts'
import mixins from './styles/mixins'
import { domSizes } from './styles/sizes'
import useCanAutoPlay from './hooks/useCanAutoPlay'
import useIsMobile from './hooks/useIsMobile'
import { minQueries } from './utils/queryUtil'
import PageMobileTemp from './components/mobileTemp/pageMobileTemp'
import HomeMobileTemp from './components/mobileTemp/homeMobileTemp'
import MobileRoutes from './components/mobile/routes'
import DesktopRoutes from './components/desktop/routes'


const App = () => {
  const isMobile = useIsMobile()
  const canAutoPlay = useCanAutoPlay()
  // const { vidLoadData, preloadManager } = usePreload(canAutoPlay)

  return (
    <StyledGlobal>
      <HashRouter>
        <Routes>
          <Route path='*' element={isMobile ?
            (process.env.NODE_ENV === 'production' ?
              <Route path='/' element={<PageMobileTemp canAutoPlay={canAutoPlay} />}>
                <Route path='' element={<HomeMobileTemp />} />
                <Route path='*' element={<Navigate to='/' replace />} />
              </Route> :
              <MobileRoutes canAutoPlay={canAutoPlay} />
            ) : <DesktopRoutes canAutoPlay={canAutoPlay} />
          } />
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
  }

  @media ${minQueries.l} {
    width: ${domSizes.desktop.app.width.css};
    a:hover {
      color: ${colorConfig.activeElem};
    }
  }
`



export default App