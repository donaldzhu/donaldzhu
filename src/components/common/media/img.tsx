import { forwardRef } from 'react'
import styled from 'styled-components'
import mixins from '../../../styles/mixins'
import type { DetailedHTMLProps, ImgHTMLAttributes } from 'react'
import type { ImgProps, StyledMediaProps } from './mediaTypes'


const Img = forwardRef<
  HTMLImageElement,
  DetailedHTMLProps<
    ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement
  > & ImgProps>(function Img({
    src,
    alt,
    hasLoaded,
    aspectRatio,
    isZoomed,
    ...props
  }, ref) {
    return (
      <StyledImg
        src={src}
        alt={alt}
        ref={ref}
        $hasLoaded={hasLoaded}
        $aspectRatio={aspectRatio}
        $isZoomed={isZoomed}
        {...props} />
    )
  })

const StyledImg = styled.img<StyledMediaProps>`
  ${mixins.media}
`

export default Img