import { styled } from 'styled-components'
import sizes from '../../../styles/sizes'

const MainContainer = styled.div`
  width: calc(${sizes.appWidth} - ${sizes.sidebarWidth});
  height: fit-content;

  position: relative;
  left: calc(${sizes.sidebarWidth} + ${sizes.sidebarPaddingLeft});

  overflow: visible;
  z-index: 2;

  > div {
    margin: ${sizes.mainContainerMargin};
    width: calc(100% - ${sizes.mainContainerMargin} * 2);
  }
`

export default MainContainer