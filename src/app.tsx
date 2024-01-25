import { HashRouter, Route, Routes } from 'react-router-dom'
import styled from 'styled-components'
import colorConfig from './styles/colors'
import { fontFamilies, fontSizes } from './styles/fonts'
import mixins from './styles/mixins'
import { domSizes } from './styles/sizes'
import useVideoTest from './hooks/useVideoTest'
import useIsMobile from './hooks/useIsMobile'
import { desktopQuery } from './utils/queryUtil'
import MobileRoutes from './components/mobile/routes'
import DesktopRoutes from './components/desktop/routes'
import usePreload from './hooks/usePreload'

const App = () => {
  const isMobile = useIsMobile()
  const autoPlayConfig = useVideoTest()
  const mediaSettings = {
    ...autoPlayConfig,
    ...usePreload({ ...autoPlayConfig, isMobile })
  }

  return (
    <StyledGlobal>
      <HashRouter>
        <Routes>
          <Route path='*' element={isMobile ?
            <MobileRoutes mediaSettings={mediaSettings} /> :
            <DesktopRoutes mediaSettings={mediaSettings} />
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

  header, footer, img, div {
    user-select: none;
    -webkit-user-select: none;
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

  @media ${desktopQuery} {
    width: ${domSizes.desktop.app.width.css};
    a:hover {
      color: ${colorConfig.activeElem};
    }
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  blockquote,
  dd,
  dt,
  figcaption,
  li,
  p {
    user-select: text;
    -webkit-user-select: text;
  }
`



export default App