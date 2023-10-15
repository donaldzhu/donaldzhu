import styled from 'styled-components'
import { domSizes } from '../../../styles/sizes'

const MainContainer = styled.div`
  width: ${domSizes.app.width.sub(domSizes.sidebar.width).css};
  height: fit-content;

  position: relative;
  left: ${domSizes.sidebar.width.add(domSizes.sidebar.padding.left).css};

  overflow: visible;
  z-index: 2;

  > div {
    margin: ${domSizes.mainContainer.margin.css};
    width: calc(100% - ${domSizes.mainContainer.margin.css} * 2);
  }
`

export default MainContainer