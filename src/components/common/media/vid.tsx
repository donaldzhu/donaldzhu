import { forwardRef, useEffect, useRef, useState } from 'react'
import { useIntersectionObserver } from '@uidotdev/usehooks'
import { useOutletContext } from 'react-router-dom'
import styled from 'styled-components'
import dashjs from 'dashjs'
import _ from 'lodash'
import mixins from '../../../styles/mixins'
import VidHelper from '../../../utils/helpers/video/vidHelper'
import useForwardedRef from '../../../hooks/useForwaredRef'
import { noRefError, validateRef } from '../../../utils/typeUtils'
import useMemoRef from '../../../hooks/useMemoRef'
import useMergedRef from '../../../hooks/useMergedRef'
import { addEventListener } from '../../../utils/reactUtils'
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
    aspectRatio,
    autoPlay = true,
    canAutoPlay,
    useNativeControl,
    ...props
  }, ref) {
    const context = useOutletContext<DesktopContextProps | MobileContextProps>()
    const canUseDash = VidHelper.canUseDash
    const vidCanAutoPlay: boolean | undefined =
      !!canAutoPlay || context?.canAutoPlay
    const [canPlay, setCanPlay] = useState(false)

    const forwardedRef = useForwardedRef(ref)
    const [mediaRef, entry] = useIntersectionObserver<HTMLVideoElement>({ threshold: 0 })
    const mergedRef = useMergedRef(forwardedRef, mediaRef)

    const playerRef = useRef<MediaPlayerClass | null>(null)
    const playerInitilizedRef = useRef(false)
    const shouldControlVid = () =>
      !useNativeControl &&
      (!canUseDash || playerInitilizedRef.current)

    const vidHelperRef = useMemoRef(() => {
      if (useNativeControl) return
      if (!validateRef(mergedRef)) throw noRefError('video ref')
      return new VidHelper(
        mergedRef,
        playerRef,
        canUseDash,
        vidCanAutoPlay
      )
    }, [])

    useEffect(() => {
      return vidHelperRef.current?.onVidCanPlay(
        () => setCanPlay(true)
      ) ?? _.noop
    }, [vidHelperRef, playerRef.current])

    useEffect(function onCanAutoPlayChange() {
      if (!validateRef(vidHelperRef)) return _.noop
      const vidHelper = vidHelperRef.current
      vidHelper.canAutoPlay = vidCanAutoPlay

      if (!shouldControlVid()) return _.noop

      if (vidCanAutoPlay) vidHelper.play()
      else vidHelper.pause()
    }, [vidCanAutoPlay, playerInitilizedRef.current])

    useEffect(function intersectionToggle() {
      if (
        !shouldControlVid() ||
        !validateRef(vidHelperRef) ||
        !entry
      ) return _.noop

      if (!entry.isIntersecting) vidHelperRef.current.pause()
      else vidHelperRef.current?.play()
    }, [entry])

    useEffect(function dashSetup() {
      if (!canUseDash || !src) return _.noop
      if (!validateRef(mergedRef)) throw noRefError('video ref')
      const player = playerRef.current = dashjs.MediaPlayer().create()
      player.initialize(mergedRef.current, src, false)
      playerInitilizedRef.current = true

      const updateMaxBitrate = () => {
        const elemWidth = mergedRef.current.getBoundingClientRect().width
        const bitrateInfoList = player.getBitrateInfoListFor('video')
        const widthList = _.uniq(bitrateInfoList.map(info => info.width))
          .sort((a, b) => a - b)
        const maxWidth = widthList.find(width => width >= elemWidth)
        if (!maxWidth) return

        const maxBitrateInfo = _.maxBy(
          bitrateInfoList.filter(info => info.width === maxWidth),
          info => info.bitrate
        )

        if (maxBitrateInfo) player.updateSettings({
          streaming: {
            abr: {
              maxBitrate: {
                audio: -1,
                video: maxBitrateInfo.bitrate / 1000
              },
            }
          }
        })
      }

      player.on('streamInitialized', updateMaxBitrate)
      const removeResizeListener = addEventListener(window, 'resize', updateMaxBitrate)

      return () => {
        player.destroy()
        playerInitilizedRef.current = false
        removeResizeListener()
      }
    }, [])

    return (
      <StyledVid
        muted
        playsInline
        src={!canUseDash ? src : undefined}
        loop={loop}
        ref={mergedRef}
        poster={poster}
        $hasLoaded={!!poster || canPlay}
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