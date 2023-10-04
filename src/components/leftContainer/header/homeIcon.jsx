import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { styled } from 'styled-components'
import useCanvas from '../../../hooks/useCanvas'
import drawHomeIcon from '../../../p5/sketches/drawHomeIcon'
import { percent, responsiveSize } from '../../../utils/styleUtils'
import { homeIconSizes } from '../../../p5/configs/vector'
import mixins from '../../../styles/mixins'
import sizes from '../../../styles/sizes'

const BASE_ICON_SIZE = [43, 44]
const HomeIcon = ({ callbackRefs, canvasStateRefs }) => {
  const placeholderRef = useRef()
  const isHoveringRef = useRef(false)

  useCanvas(() => drawHomeIcon({ placeholderRef, isHoveringRef }), {
    callbackRefs, canvasStateRefs
  })

  const handleHover = isOver => isHoveringRef.current = isOver

  return (
    <HomeButtonContainer ref={placeholderRef}>
      <HomeButtonLink
        to='/'
        onMouseOver={() => handleHover(true)}
        onMouseOut={() => handleHover(false)} />
    </HomeButtonContainer>
  )
}

const homeIconSize = responsiveSize(homeIconSizes)
const HomeButtonContainer = styled.div`
  ${mixins.flex('center', 'center')}
  width: calc(${BASE_ICON_SIZE[0]} * ${homeIconSize} + ${sizes.homeIconPadding});
  height: calc(${BASE_ICON_SIZE[1]} * ${homeIconSize} + ${sizes.homeIconPadding});
  position: relative;
  left: calc(${sizes.homeIconPadding} / -2);
`

const HomeButtonLink = styled(Link)`
  ${mixins.squared(percent(85))}
  z-index: 2;
  display: block;
`

export default HomeIcon