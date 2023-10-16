import { useIntersectionObserver } from '@uidotdev/usehooks'
import { forwardRef, useEffect, VideoHTMLAttributes } from 'react'
import { useOutletContext } from 'react-router-dom'
import styled from 'styled-components'
import _ from 'lodash'
import mixins from '../../../styles/mixins'
import Video from '../../../utils/helpers/video/video'
import useForwardedRef from '../../../hooks/useForwaredRef'
import { PageContextProps } from '../../pageWrappers/pageTypes'
import { validateRef } from '../../../utils/typeUtils'
import useMemoRef from '../../../hooks/useMemoRef'
import { StyledMediaProps, VidProps } from './mediaTypes'


const Vid = forwardRef<HTMLVideoElement, VideoHTMLAttributes<HTMLVideoElement> & VidProps>(
  function Vid({
    alt,
    poster,
    loop = true,
    hasLoaded,
    aspectRatio,
    autoPlay = true,
    canAutoPlay,
    useNativeControl,
    ...props
  }, ref) {
    const vidCanAutoPlay: boolean | undefined =
      useOutletContext<PageContextProps>()?.canAutoPlay ?? canAutoPlay

    const forwardedRef = useForwardedRef(ref)
    const [mediaRef, entry] = useIntersectionObserver<HTMLVideoElement>({ threshold: 0 })

    useEffect(() => {
      forwardedRef.current = mediaRef.current
    }, [mediaRef])

    const video = useMemoRef(() => {
      if (useNativeControl) return
      if (!validateRef(mediaRef)) throw new Error('Video’s ref.current is unexpectedly null')
      return new Video(mediaRef, vidCanAutoPlay)
    }, [])

    useEffect(() => {
      if (!!useNativeControl || !validateRef(video)) return _.noop
      video.current.canAutoPlay = vidCanAutoPlay
      video.current.play()
    }, [vidCanAutoPlay])


    useEffect(() => {
      if (!!useNativeControl || !validateRef(video)) return _.noop
      if (!entry?.isIntersecting) video.current.pause()
      else video.current?.play()
    }, [entry])

    return (
      <StyledVid
        muted
        loop={loop}
        ref={mediaRef}
        poster={poster}
        $hasLoaded={hasLoaded}
        $aspectRatio={aspectRatio}
        autoPlay={useNativeControl && (canAutoPlay !== false && autoPlay)}
        {...props}>
        {alt}
      </StyledVid>
    )
  })

const StyledVid = styled.video<StyledMediaProps>`
  ${(props) => mixins.media(props)}
`

export default Vid