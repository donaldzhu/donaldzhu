import { forwardRef, ImgHTMLAttributes } from 'react'
import styled from 'styled-components'
import mixins from '../../../styles/mixins'
import { ImgProps, StyledMediaProps } from './mediaTypes'

const Img = forwardRef<HTMLImageElement, ImgHTMLAttributes<HTMLImageElement> & ImgProps>(
  function Img({ src, alt, hasLoaded, aspectRatio, ...props }, ref) {
    return (
      <StyledImg
        src={src}
        alt={alt}
        ref={ref}
        $hasLoaded={hasLoaded}
        $aspectRatio={aspectRatio}
        {...props} />
    )
  })

const StyledImg = styled.img<StyledMediaProps>`
  ${mixins.media}
`

export default Img