import { useWindowSize } from '@uidotdev/usehooks'
import { useMemo } from 'react'
import styled from 'styled-components'
import colors from '../../styles/colors'
import { domSizes } from '../../styles/sizes'
import Size from '../../utils/helpers/size'
import Svg from './svg'

interface SvgBorderProps {
  className?: string
  size: Size
  isVertical?: boolean
}

const SvgBorder = ({ className, size, isVertical }: SvgBorderProps) => {
  const windowSize = useWindowSize()
  const { dimension, strokeWidth } = useMemo(() => {
    return {
      dimension: size.value,
      strokeWidth: domSizes.desktop.sidebar.border.value
    }
  }, [windowSize])

  const lengths = [dimension, 0, dimension]
  const thicknesses = [strokeWidth, strokeWidth / 2, strokeWidth / 2]

  const [w, x1, x2] = isVertical ? thicknesses : lengths
  const [h, y1, y2] = isVertical ? lengths : thicknesses

  return (
    <Container className={className}>
      <Svg w={w} h={h}>
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={colors.border}
          strokeWidth={strokeWidth}
          strokeLinecap='round'
        />
      </Svg>
    </Container>
  )
}

const Container = styled.div`
  height: fit-content;

  svg {
    overflow: visible;
    display: block;
  }
`


export default SvgBorder