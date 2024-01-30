import { forwardRef, useEffect, useRef, useState } from 'react'
import { useIntersectionObserver, usePrevious } from '@uidotdev/usehooks'
import { useOutletContext } from 'react-router-dom'
import styled from 'styled-components'
import dashjs from 'dashjs'
import _ from 'lodash'
import mixins from '../../../styles/mixins'
import VidHelper from '../../../utils/helpers/video/vidHelper'
import useForwardedRef from '../../../hooks/useForwaredRef'
import { validateRef } from '../../../utils/typeUtils'
import useMemoRef from '../../../hooks/useMemoRef'
import useMergedRef from '../../../hooks/useMergedRef'
import useIsMobile from '../../../hooks/useIsMobile'
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
    currentTime,
    isZoomed,
    canAutoPlay,
    useNativeControl,
    ...props
  }, ref) {

    // environment
    const context = useOutletContext<DesktopContextProps | MobileContextProps>()
    const vidCanAutoPlay: boolean | undefined =
      !!canAutoPlay || context?.canAutoPlay
    const canUseDash = VidHelper.canUseDash
    const isMobile = useIsMobile()
    const [canPlay, setCanPlay] = useState(false)

    const hasZoomed = !!context?.zoomMedia
    const prevHasZoomed = usePrevious(hasZoomed)

    // elem refs
    const forwardedRef = useForwardedRef(ref)
    const [mediaRef, entry] = useIntersectionObserver<HTMLVideoElement>({ threshold: 0 })
    const mergedRef = useMergedRef(forwardedRef, mediaRef)

    // playerRefs
    const playerRef = useRef<MediaPlayerClass | null>(null)
    const playerInitilizedRef = useRef(false)
    const playerSeekedRef = useRef(false)

    const vidHelperIsEnabled = () => !useNativeControl && vidCanAutoPlay &&
      (!canUseDash || playerInitilizedRef.current)

    const vidHelperRef = useMemoRef(() => {
      if (!useNativeControl && validateRef(mergedRef))
        return new VidHelper(
          mergedRef,
          playerRef,
          canUseDash,
          vidHelperIsEnabled()
        )
    }, [])

    useEffect(() => {
      const isEnabled = vidHelperIsEnabled()
      console.log(isEnabled)
      if (!validateRef(vidHelperRef) || !isEnabled)
        return
      vidHelperRef.current.enabled = isEnabled
      vidHelperRef.current.play()
    }, [vidCanAutoPlay, playerInitilizedRef.current])

    useEffect(
      () => vidHelperRef.current?.onVidCanPlay(() => setCanPlay(true)),
      [vidHelperRef, playerRef.current]
    )

    const toggle = (shouldPlay?: boolean | null) => {
      if (!validateRef(vidHelperRef)) return

      const vidHelper = vidHelperRef.current
      if (shouldPlay) vidHelper.play()
      else if (shouldPlay === false)
        vidHelper.pause()
    }

    // useEffect(
    //   () => toggle(entry?.isIntersecting),
    //   [entry, entry?.isIntersecting]
    // )

    useEffect(() => {
      if (!isZoomed) toggle(
        (hasZoomed && prevHasZoomed === false) ? false :
          (!hasZoomed && prevHasZoomed) ? true : undefined
      )
    }, [hasZoomed])

    const catchup = () => {
      if (isZoomed && !isMobile && validateRef(vidHelperRef))
        vidHelperRef.current.catchup(currentTime)
    }

    const dashSetup = () => {
      const player = playerRef.current = dashjs.MediaPlayer().create()
      player.initialize(mergedRef.current!, src, !!isZoomed || vidCanAutoPlay)
      playerInitilizedRef.current = true

      const updateMaxBitrate = () => {
        const elemWidth = mergedRef.current!.getBoundingClientRect().width
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
            },
            // TODO
            // buffer: {
            //   flushBufferAtTrackSwitch: true
            // }
          },
          debug: {
            logLevel: src?.match('vector-struct') ? 5 : 3
          }
        })
      }

      catchup()

      player.on('streamInitialized', updateMaxBitrate)
      const removeResizeListener = addEventListener(window, 'resize', updateMaxBitrate)

      return () => {
        player.destroy()
        playerInitilizedRef.current = false
        playerSeekedRef.current = false
        removeResizeListener()
      }
    }

    useEffect(() => {
      if (!src || !validateRef(mergedRef)) return
      if (!canUseDash) catchup()
      else return dashSetup()
    }, [])

    return (
      <StyledVid
        muted
        playsInline
        preload='metadata'
        src={!canUseDash ? src : undefined}
        loop={loop}
        ref={mergedRef}
        poster={poster}
        $hasLoaded={!!poster || canPlay}
        $aspectRatio={aspectRatio}
        $isZoomed={isZoomed}
        autoPlay={useNativeControl && (canAutoPlay !== false && autoPlay)}
        {...props}>
        {alt}
      </StyledVid>
    )
  })

const StyledVid = styled.video<StyledMediaProps>`
  ${mixins.media}
`

export default Vid