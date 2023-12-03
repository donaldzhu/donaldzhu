import { forwardRef, useEffect } from 'react'
import { useIntersectionObserver } from '@uidotdev/usehooks'
import { useOutletContext } from 'react-router-dom'
import styled from 'styled-components'
import _ from 'lodash'
import mixins from '../../../styles/mixins'
import Video from '../../../utils/helpers/video/video'
import useForwardedRef from '../../../hooks/useForwaredRef'
import { validateRef } from '../../../utils/typeUtils'
import useMemoRef from '../../../hooks/useMemoRef'
import useMergedRef from '../../../hooks/useMergedRef'
import type { DetailedHTMLProps, VideoHTMLAttributes } from 'react'
import type { DesktopContextProps } from '../../desktop/pageWrappers/pageTypes'
import type { MobileContextProps } from '../../mobile/pageWrappers/pageTypes'
import type { StyledMediaProps, VidProps } from './mediaTypes'


const Vid = forwardRef<
  HTMLVideoElement,
  DetailedHTMLProps<
    VideoHTMLAttributes<HTMLVideoElement>, HTMLVideoElement
  > & VidProps>(({
    alt,
    poster,
    loop = true,
    hasLoaded,
    aspectRatio,
    autoPlay = true,
    canAutoPlay,
    useNativeControl,
    ...props
  }, ref) => {
    const contextCanAutoPlay =
      useOutletContext<DesktopContextProps | MobileContextProps>()?.canAutoPlay
    const vidCanAutoPlay: boolean | undefined =
      canAutoPlay ?? contextCanAutoPlay

    const forwardedRef = useForwardedRef(ref)
    const [mediaRef, entry] = useIntersectionObserver<HTMLVideoElement>({ threshold: 0 })
    const mergedRef = useMergedRef(forwardedRef, mediaRef)

    const video = useMemoRef(() => {
      if (useNativeControl) return
      if (!validateRef(mergedRef)) throw new Error('Video’s ref.current is unexpectedly null')
      return new Video(mergedRef, vidCanAutoPlay)
    }, [])

    useEffect(() => {
      if (!!useNativeControl || !validateRef(video)) return _.noop
      video.current.canAutoPlay = vidCanAutoPlay
      if (canAutoPlay) video.current.play()
      else video.current.pause()
    }, [vidCanAutoPlay])

    useEffect(() => {
      if (!!useNativeControl || !validateRef(video) || !entry) return _.noop
      if (!entry.isIntersecting) video.current.pause()
      else video.current?.play()
    }, [entry])

    return (
      <StyledVid
        muted
        playsInline
        loop={loop}
        ref={mergedRef}
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