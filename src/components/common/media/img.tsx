import { ImgHTMLAttributes, forwardRef } from 'react'
import styled from 'styled-components'
import _ from 'lodash'
import mixins from '../../../styles/mixins'
import { ImgProps } from './mediaTypes'


interface StyledImgProps {
  $hasLoaded: boolean
  $aspectRatio: string
}

const Img = forwardRef<HTMLImageElement, ImgHTMLAttributes<HTMLImageElement> & ImgProps>(
  function Img({ src, alt, hasLoaded, aspectRatio, ...props }, ref) {
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

const StyledImg = styled.img<StyledImgProps>`
  ${mixins.media}
`

export default Img