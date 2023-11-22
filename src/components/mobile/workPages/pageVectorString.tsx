import { useEffect, useRef, useState } from 'react'
import _ from 'lodash'
import styled from 'styled-components'
import Anchor from '../../common/anchor'
import WorkImg from '../../common/media/workImg'
import RowContainer from '../../common/rowContainer'
import SmallText from '../../common/styled/smallText'
import TextContainer from '../../common/styled/textContainer'
import { addEventListener } from '../../../utils/reactUtils'
import { validateRef } from '../../../utils/typeUtils'
import { getVh } from '../../../utils/sizeUtils'
import Canvas from '../../common/canvas/canvas'
import drawVectorStringMobile from '../../../p5/sketches/drawVectorStringMobile'
import useMemoRef from '../../../hooks/useMemoRef'
import VideoIframe from '../../common/media/videoIframe'
import { VideoIframeType } from '../../common/media/mediaTypes'
import type { WorkPageContentProps } from '../work/workPageTypes'


const PageVectorString = ({ WorkInfo }: WorkPageContentProps) => {
  const [translateImgSrc, setTranslateImgSrc] = useState(1)
  const translateImgSrcRef = useMemoRef(() => translateImgSrc, [translateImgSrc])
  const tranlsateImgCount = 20
  const translateImgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!validateRef(translateImgRef)) return _.noop

    return addEventListener(window, 'scroll', () => {
      const translateImg = translateImgRef.current
      const { top } = translateImg.getBoundingClientRect()
      const vh = getVh()
      const dist = Math.max(0, vh - top)
      const stepDist = Math.min(vh / tranlsateImgCount, 25)
      setTranslateImgSrc((Math.floor(dist / stepDist) % tranlsateImgCount + 1))
    })
  }, [])

  return (
    <>
      <RowContainer>
        <WorkImg src='1.webp' />
      </RowContainer>
      <WorkInfo />
      <TextContainer>
        <SmallText>(Part of my <Anchor to='../vector-spin-stroke'>investigation on tools</Anchor>).</SmallText>
        <SmallText>
          The 2D iteration of <i><Anchor to='../vector-struct'>VECTOR-STRUCT</Anchor>:</i> an
          assortment of glyphs drawn on layers of vellum, which are then connected at
          their anchor points with strings.
        </SmallText>
        <SmallText>
          <i>
            By borrowing the logic of interpolation, VECTOR began as an exercise in deconstructing
            the forms of the flat nib pen to investigate the relationship between parametric parts.
            It grants one the ability to manipulate the points, lines, areas, and volumes via
            movement by connecting the layers with elastic material.
          </i>
        </SmallText>
      </TextContainer>
      <RowContainer ref={translateImgRef}>
        <WorkImg src={`translate/${translateImgSrc}.webp`} />
      </RowContainer>
      <SketchContainer>
        <SketchCanvas {...drawVectorStringMobile({ imgSrcRef: translateImgSrcRef })} />
      </SketchContainer>
      <TextContainer>
        <SmallText>
          <i>
            Through its material resistance, it provides kinaesthetic feedback to
            specific actions (rotation, displacement) and intrinsic typographic properties
            (min-max distances, weight, contrast, etc.).
          </i>
        </SmallText>
      </TextContainer>
      <RowContainer>
        <VideoIframe
          type={VideoIframeType.Youtube}
          src='vPiSml8Y62k'
          aspectRatio='5 / 3'
          title='VECTOR [STRING]' />
      </RowContainer>
      <RowContainer>
        <WorkImg src='2.webp' />
        <WorkImg src='3.webp' />
        <WorkImg src='4.webp' />
      </RowContainer>
      <RowContainer>
        <WorkImg src='5.webp' />
        <WorkImg src='6.webp' />
        <WorkImg src='7.webp' />
      </RowContainer>
      <TextContainer>
        <SmallText>
          <i>
            The resulting formal studies are an iterative, embodied process
            of unearthing vector relations within physical typographic forms.
          </i>
        </SmallText>
      </TextContainer>
      <RowContainer>
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
      <RowContainer>
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
      <RowContainer>
        <WorkImg src='18.webp' />
      </RowContainer>
    </>
  )
}

const SketchContainer = styled(RowContainer)`
  aspect-ratio: 2;
`

const SketchCanvas = styled(Canvas)`
  width: 100%;
  height: 100%;
`

export default PageVectorString