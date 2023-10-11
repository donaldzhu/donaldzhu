import { styled } from 'styled-components'
import { sizes } from '../../../styles/sizes'

const MainContainer = styled.div`
  width: ${sizes.app.width.sub(sizes.sidebar.width).css};
  height: fit-content;

  position: relative;
  left: ${sizes.sidebar.width.add(sizes.sidebar.padding.left).css};

  overflow: visible;
  z-index: 2;

  > div {
    margin: ${sizes.mainContainer.margin.css};
    width: calc(100% - ${sizes.mainContainer.margin.css} * 2);
  }
`

export default MainContainer