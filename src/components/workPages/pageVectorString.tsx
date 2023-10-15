import { useEffect, useRef, useState } from 'react'
import useCanvas from '../../hooks/useCanvas'
import drawVectorString from '../../p5/sketches/drawVectorString'
import ElemRect from '../../utils/helpers/rect/elemRect'
import { addEventListener } from '../../utils/reactUtils'
import { validateRef } from '../../utils/typeUtils'
import { VideoIframeType } from '../common/media/mediaTypes'
import VideoIframe from '../common/media/videoIframe'
import WorkImg from '../common/media/workImg'
import RowContainer from '../common/rowContainer'

const PageVectorString = () => {
  const [translateImgSrc, setTranslateImgSrc] = useState(1)
  const translateContainerRef = useRef<HTMLDivElement | null>(null)
  const translatePlaceholderRef = useRef<HTMLDivElement | null>(null)
  const tranlsateImgCount = 20

  useEffect(() => {
    let translateContainer: ElemRect<HTMLDivElement>
    return addEventListener(document.body, 'mousemove', ({ clientX, clientY }) => {
      if (!validateRef(translateContainerRef)) return
      translateContainer ??= new ElemRect(translateContainerRef)
      let angle = Math.atan2(clientY - translateContainer.cy, clientX - translateContainer.cx)
      if (angle <= 0) angle = Math.PI * 2 + angle
      const src = Math.ceil(angle / (Math.PI * 2 / tranlsateImgCount))
      setTranslateImgSrc(src)
    })
  }, [])

  useCanvas(() => drawVectorString({
    containerRef: translateContainerRef,
    placeholderRef: translatePlaceholderRef
  }))

  return (
    <>
      <RowContainer>
        <WorkImg src='1.webp' />
      </RowContainer>
      <RowContainer cols={[4, 3]} ref={translateContainerRef}>
        <WorkImg src={`translate/${translateImgSrc}.webp`} />
        <div ref={translatePlaceholderRef} />
      </RowContainer>
      <RowContainer toolTip={
        <p>
          <b>2D-Transform:</b> Translate;
        </p>
      }>
        <WorkImg src='2.webp' />
        <WorkImg src='3.webp' />
        <WorkImg src='4.webp' />
      </RowContainer>
      <RowContainer>
        <VideoIframe
          type={VideoIframeType.Youtube}
          src='vPiSml8Y62k'
          aspectRatio='5 / 3'
          title='VECTOR [STRING]' />
      </RowContainer>
      <RowContainer toolTip={
        <p>
          <b>2D-Transform:</b> Rotate;
        </p>
      }>
        <WorkImg src='5.webp' />
        <WorkImg src='6.webp' />
        <WorkImg src='7.webp' />
      </RowContainer>
      <RowContainer toolTip={
        <p>
          <b>Varied Forms S</b> —
          using slightly different letterforms for the two connected glyphs.
        </p>
      }>
        <WorkImg src='8.webp' />
      </RowContainer>
      <RowContainer>
        <WorkImg src='9.webp' />
        <WorkImg src='10.webp' />
      </RowContainer>
      <RowContainer>
        <WorkImg src='11.webp' />
        <WorkImg src='12.webp' />
      </RowContainer>
      <RowContainer toolTip={
        <p>
          <b>Three-Layered G</b> —
          using three layers of vellum; the resulting output appears a lot more structural.
        </p>
      }>
        <WorkImg src='13.webp' />
      </RowContainer>
      <RowContainer>
        <WorkImg src='14.webp' />
        <WorkImg src='15.webp' />
      </RowContainer>
      <RowContainer>
        <WorkImg src='16.webp' />
        <WorkImg src='17.webp' />
      </RowContainer>
      <RowContainer toolTip='Superimposed image of multiple A with different angles of translation.'>
        <WorkImg src='18.webp' />
      </RowContainer>
    </>
  )
}

export default PageVectorString