import { VideoHTMLAttributes, forwardRef, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { usePrevious } from '@uidotdev/usehooks'
import styled from 'styled-components'
import mixins from '../../../styles/mixins'
import { StyledMediaProps, VidProps } from './mediaTypes'
import { PageContextProps } from '../../pageWrappers/pageTypes'


const Vid = forwardRef<HTMLVideoElement, VideoHTMLAttributes<HTMLVideoElement> & VidProps>(
  function Vid({ src, alt, poster, loop = true, hasLoaded, aspectRatio, autoPlay = true, ...props }, ref) {
    const canAutoPlay: boolean | undefined = useOutletContext<PageContextProps>()?.canAutoPlay
    const prevCanAutoPlay = usePrevious(canAutoPlay)

    useEffect(() => {
      if (
        prevCanAutoPlay === false &&
        canAutoPlay &&
        ref &&
        'current' in ref &&
        ref.current &&
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

const StyledVid = styled.video<StyledMediaProps>`
  ${(props) => mixins.media(props)}
`

export default Vid