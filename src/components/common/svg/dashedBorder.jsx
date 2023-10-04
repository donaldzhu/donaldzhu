import { styled } from 'styled-components'
import Rect from './rect'
import Svg from './svg'

const DashedBorder = ({ x = 0, y = 0, w = 400, h = 200 }) => {
  const rect = new Rect({ x, y, w, h }) // memoize
  const poly = rect.getPolyline()
  const lines = rect.getLine()

  return (
    <SvgContainer>
      <Svg w={rect.paddedW} h={rect.paddedH}>
        {poly.map((points, i) => <polyline
          key={i}
          points={points}
          style={rect.polyLineStyle} />)}
        {lines.map((coors, i) => <line
          key={i}
          {...coors}
          style={rect.lineStyles[Math.floor(i / 2)]} />)}
      </Svg>
    </SvgContainer>
  )
}

const SvgContainer = styled.div`
  position:absolute;  
`

export default DashedBorder