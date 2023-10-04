import { forwardRef, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { usePrevious } from '@uidotdev/usehooks'
import styled from 'styled-components'
import mixins from '../../../styles/mixins'

const Vid = forwardRef(({ src, alt, poster, loop = true, hasLoaded, aspectRatio, autoPlay = true, ...props }, ref) => {
  const canAutoPlay = useOutletContext()?.canAutoPlay
  const prevCanAutoPlay = usePrevious(canAutoPlay)

  useEffect(() => {
    if (
      prevCanAutoPlay === false &&
      canAutoPlay &&
      ref?.current &&
      autoPlay
    ) ref.current.play()
  }, [canAutoPlay])

  return (
    <StyledVid
      muted
      loop={loop}
      ref={ref}
      poster={poster}
      $hasLoaded={hasLoaded}
      $aspectRatio={aspectRatio}
      autoPlay={canAutoPlay !== false && autoPlay}
      {...props}>
      {alt}
      <source src={src} />
    </StyledVid>
  )
})

const StyledVid = styled.video`
  ${(props) => mixins.media(props)}
`

export default Vid