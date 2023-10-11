import { forwardRef } from 'react'
import styled from 'styled-components'
import mixins from '../../../styles/mixins'
import _ from 'lodash'

const Img = forwardRef(function Img({ src, alt, hasLoaded, aspectRatio, ...props }, ref) {
  return (
    <StyledImg
      src={src}
      alt={alt}
      ref={ref}
      $hasLoaded={hasLoaded}
      $aspectRatio={aspectRatio}
      {..._.omit(props, ['poster'])} />
  )
})

const StyledImg = styled.img`
  ${(props) => mixins.media(props)}
`

export default Img