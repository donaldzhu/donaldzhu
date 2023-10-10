import { useRef } from 'react'
import { styled } from 'styled-components'
import Anchor from '../../common/anchor'
import useCanvas from '../../../hooks/useCanvas'
import drawHomeIcon from '../../../p5/sketches/drawHomeIcon'
import { percent } from '../../../utils/styleUtils'
import mixins from '../../../styles/mixins'
import sizes from '../../../styles/sizes'

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

const HomeButtonContainer = styled.div`
  ${mixins.flex('center', 'center')}
  width: ${sizes.homeIconWidth};
  height: ${sizes.homeIconHeight};
  position: relative;
  left: calc(${sizes.homeIconPadding} / -2);
  margin-bottom: ${sizes.homeIconPaddingTop};
`

const HomeButtonLink = styled(Anchor)`
  ${mixins.squared(percent(85))}
  z-index: 2;
  display: block;
`

export default HomeIcon