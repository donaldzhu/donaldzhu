import { useRef, useState } from 'react'
import { styled } from 'styled-components'
import Svg from './svg'
import SvgDashedRect from '../../../utils/helpers/svgDashedRect'
import useMemoRef from '../../../hooks/useMemoRef.ts'
import { px } from '../../../utils/styleUtils'
import useAnimate from '../../../hooks/useAnimate'
import _ from 'lodash'

const DashedBorder = ({ padding }) => {
  padding = typeof padding === 'number' ? px(padding) : padding
  const containerRef = useRef()
  const rect = useMemoRef(() => new SvgDashedRect(containerRef), [containerRef])
  const [rectData, setRectData] = useState()

  useAnimate(() => {
    if (!rect || !containerRef.current) return
    setRectData(_.pick(rect.current, ['paddedW', 'paddedH', 'polyLineStyle',
      'lineStyles', 'polylines', 'lines']))
  }, [rect, containerRef])

  return (
    <SvgContainer
      ref={containerRef}
      $padding={padding}>
      {rectData &&
        <Svg w={rectData.paddedW} h={rectData.paddedH}>
          {rectData.polylines.map((points, i) => <polyline
            key={i}
            points={points}
            style={rectData.polyLineStyle} />)}
          {rectData.lines.map((coors, i) => <line
            key={i}
            {...coors}
            style={rectData.lineStyles[Math.floor(i / 2)]} />)}
        </Svg>}
    </SvgContainer>
  )
}

const getSize = () => ({ $padding }) => `calc(100%${$padding ? ` + ${$padding} * 2` : ''})`
const getPadding = () => ({ $padding }) => $padding ? `calc(${$padding} * -1)` : ''
const SvgContainer = styled.div`
  position: absolute;  
  width: ${getSize()};
  height: ${getSize()};
  left: ${getPadding()};
  top:${getPadding()};

  svg {
    position: absolute;
    top: 0;
    left: 0;
  }
`

export default DashedBorder