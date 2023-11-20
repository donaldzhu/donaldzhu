import styled from 'styled-components'
import { domSizes } from '../../../styles/sizes'

const MainContainer = styled.div`
  width: ${domSizes.desktop.mainContainer.width.css};
  height: fit-content;

  position: relative;
  left: ${domSizes.desktop.mainContainer.left.css};

  overflow: visible;
  z-index: 2;

  > div {
    margin: ${domSizes.desktop.mainContainer.margin.css};
    width: calc(100% - ${domSizes.desktop.mainContainer.margin.css} * 2);
  }
`

export default MainContainer