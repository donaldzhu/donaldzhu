import { useMemo } from 'react'
import styled from 'styled-components'
import { useWindowSize } from '@uidotdev/usehooks'
import { fontFamilies } from '../../styles/fonts'
import colors from '../../styles/colors'
import { domSizes } from '../../styles/sizes'
import Size from '../../utils/helpers/size'

interface StyledBannerProps {
  $shift: number
  $y1: number,
  $y2: number
}

const { top } = domSizes.mobile.home.blocker
const MobileConstructionBanner = ({ $shift, $y1, $y2 }: StyledBannerProps) => {
  const pxPosition = (percentage: number) =>
    new Size({ vh: 100 }).sub(top)
      .mult(percentage / 100)
      .value

  const windowSize = useWindowSize()
  const y1 = useMemo(() => pxPosition($y1), [windowSize])
  const y2 = useMemo(() => pxPosition($y2), [windowSize])

  return (
    <Banner $y1={y1} $y2={y2} $shift={$shift}>
      {Array(4).fill('Mobile Site Under Construction').join(' - ')}
    </Banner>
  )
}


const MobileConstructionTemp = () => {
  return (
    <BannerContainer>
      <MobileConstructionBanner $y1={52.5} $y2={60} $shift={-85} />
      <MobileConstructionBanner $y1={25} $y2={10} $shift={-40} />
      <MobileConstructionBanner $y1={40} $y2={35} $shift={-115} />
      <MobileConstructionBanner $y1={7.5} $y2={30} $shift={-10} />
      <MobileConstructionBanner $y1={85} $y2={52.5} $shift={-175} />
      <MobileConstructionBanner $y1={70} $y2={87.5} $shift={-22.5} />
    </BannerContainer>
  )
}

const BannerContainer = styled.div`
  position: fixed;
  top: ${domSizes.mobile.home.blocker.top.css};
 
  color: ${colors.popUpColor};

  font-family: ${fontFamilies.sansFont};
  font-size: 1.25rem;
  font-style: italic;
`

const Banner = styled.p<StyledBannerProps>`
  background-color: ${colors.background};
  white-space: nowrap;
  position: absolute;
  outline: ${domSizes.mobile.home.blocker.border.css} solid ${colors.border};
  transform-origin: left center;
  transform: ${({ $shift, $y1, $y2 }) => {
    const angle = Math.atan2($y2 - $y1, window.innerWidth)
    const xShift = Math.cos(angle) * $shift
    const yShift = Math.sin(angle) * $shift
    return `translate(${xShift}px, ${$y1 + yShift}px) rotate(${angle}rad)`
  }};
  padding: 0.35em 0 0.25em; 
`

export default MobileConstructionTemp