import { forwardRef, useEffect, useRef } from 'react'
import { useIntersectionObserver } from '@uidotdev/usehooks'
import { useOutletContext } from 'react-router-dom'
import styled from 'styled-components'
import dashjs from 'dashjs'
import _ from 'lodash'
import mixins from '../../../styles/mixins'
import Video from '../../../utils/helpers/video/video'
import useForwardedRef from '../../../hooks/useForwaredRef'
import { validateRef } from '../../../utils/typeUtils'
import useMemoRef from '../../../hooks/useMemoRef'
import useMergedRef from '../../../hooks/useMergedRef'
import { addEventListener } from '../../../utils/reactUtils'
import bitrateMap from '../../../data/media/bitrate-map.json'
import type { DetailedHTMLProps, VideoHTMLAttributes } from 'react'
import type { MediaPlayerClass } from 'dashjs'
import type { DesktopContextProps } from '../../desktop/pageWrappers/pageTypes'
import type { MobileContextProps } from '../../mobile/pageWrappers/pageTypes'
import type { StyledMediaProps, VidProps } from './mediaTypes'


const Vid = forwardRef<
  HTMLVideoElement,
  DetailedHTMLProps<
    VideoHTMLAttributes<HTMLVideoElement>, HTMLVideoElement
  > & VidProps>(function Vid({
    src,
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
    const context = useOutletContext<DesktopContextProps | MobileContextProps>()
    const canUseDash = context ? context.canUseDash : dashjs.supportsMediaSource()
    const vidCanAutoPlay: boolean | undefined =
      !!canAutoPlay || context?.canAutoPlay

    const forwardedRef = useForwardedRef(ref)
    const [mediaRef, entry] = useIntersectionObserver<HTMLVideoElement>({ threshold: 0 })
    const mergedRef = useMergedRef(forwardedRef, mediaRef)

    const playerRef = useRef<MediaPlayerClass | null>(null)
    const playerInitilizedRef = useRef(false)
    const shouldControlVid = () =>
      !useNativeControl &&
      (!canUseDash || playerInitilizedRef.current)

    const video = useMemoRef(() => {
      if (useNativeControl) return
      if (!validateRef(mergedRef)) throw new Error('Video’s ref.current is unexpectedly null')
      return new Video(
        mergedRef,
        playerRef,
        canUseDash,
        vidCanAutoPlay,
        playerInitilizedRef
      )
    }, [])

    useEffect(() => {
      if (!validateRef(video)) return _.noop
      video.current.canAutoPlay = vidCanAutoPlay

      if (!shouldControlVid()) return _.noop

      if (vidCanAutoPlay) video.current.play()
      else video.current.pause()
    }, [vidCanAutoPlay, playerInitilizedRef.current])

    useEffect(() => {
      if (
        !shouldControlVid() ||
        !validateRef(video) ||
        !entry
      ) return _.noop

      if (!entry.isIntersecting) video.current.pause()
      else video.current?.play()
    }, [entry])

    useEffect(() => {
      if (!canUseDash || !src) return _.noop
      if (!validateRef(mergedRef)) throw new Error('Video’s ref.current is unexpectedly null')
      const player = playerRef.current = dashjs.MediaPlayer().create()
      playerInitilizedRef.current = true

      const elemHeight = mergedRef.current.getBoundingClientRect().height

      const heightList = _
        .uniq(Object.values(bitrateMap))
        .sort((a, b) => a - b)
      const maxHeight = heightList.find(width => width >= elemHeight)
      if (!maxHeight) return

      const maxBitrates = _.pickBy(bitrateMap, width => width === maxHeight)
      const filteredBitrates = Object.keys(maxBitrates)
        .map(bitrateString => parseInt(bitrateString))
      const maxBitrate = Math.max(...filteredBitrates)

      player.updateSettings({
        streaming: {
          abr: {
            maxBitrate: { audio: -1, video: maxBitrate / 1000 },
          }
        }
      })
      console.log(src, maxBitrate)

      player.on('playbackStarted', () => {
        setInterval(() => {
          if (validateRef(playerRef))
            console.log(
              playerRef.current.getBitrateInfoListFor('video')[playerRef.current.getQualityFor('video')].bitrate
            )
        }, 2000)
      })

      player.initialize(mergedRef.current, src, false)

      return () => {
        player.destroy()
        playerInitilizedRef.current = false
      }
    }, [])



    return (
      <StyledVid
        muted
        src={!canUseDash ? src : undefined}
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