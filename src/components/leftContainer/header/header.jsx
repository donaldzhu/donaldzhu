import { forwardRef } from 'react'
import { styled } from 'styled-components'
import HomeIcon from './homeIcon'
import sizes from '../../../styles/sizes'
import Svg from '../../common/svg'
import colors from '../../../styles/colors'

const Header = forwardRef(({ callbackRefs, canvasStateRefs }, ref) => {
  const stroke = sizes.borderWeightValue()
  return (
    <header ref={ref}>
      <HomeIconContainer>
        <HomeIcon
          callbackRefs={callbackRefs}
          canvasStateRefs={canvasStateRefs} />
        <SvgContainer>
          <Svg w={sizes.sidebarWidthValue} h={stroke}>
            <line
              x1='0'
              y1={stroke / 2}
              x2={sizes.sidebarWidthValue}
              y2={stroke / 2}
              stroke={colors.border}
              strokeWidth={stroke}
              strokeLinecap='round'
            />
          </Svg>
        </SvgContainer>
      </HomeIconContainer>
    </header>
  )
})

const HomeIconContainer = styled.div`
  padding-top: ${sizes.homeIconPaddingTop};
`

const SvgContainer = styled.div`
  height: fit-content;

  svg {
    overflow: visible;
    display: block;
  }
`

export default Header