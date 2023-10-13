import { useRef, useState } from 'react'
import { styled } from 'styled-components'
import RowContainer from '../common/rowContainer'
import VideoIframe from '../common/media/videoIframe'
import WorkImg from '../common/media/workImg'
import WorkVid from '../common/media/workVid'
import WorkImgGroup from '../common/media/workImgGroup'
import useCanvas from '../../hooks/useCanvas'
import drawPanto from '../../p5/sketches/drawPanto'
import drawElemBorders from '../../p5/sketches/drawElemBorders'
import { fontParams, fontSizes } from '../../styles/fonts'
import mixins from '../../styles/mixins'
import { domSizes } from '../../styles/sizes'
import colors from '../../styles/colors'
import { VideoIframeType } from '../common/media/mediaTypes'

const PageStroke = () => {
  const [hoveringCard, setHoveringCard] = useState(null)
  const placeholderRef = useRef()
  const isClearingRef = useRef(false)
  const cardRefs = [useRef(), useRef(), useRef()]

  useCanvas(() => drawElemBorders({ elemRefs: [placeholderRef, ...cardRefs] }))
  useCanvas(() => drawPanto({ placeholderRef, isClearingRef }))

  const handleClear = () => isClearingRef.current = true

  const handleOnHover = (i, isOver) => setHoveringCard(isOver ? i : null)
  return (
    <>
      <RowContainer>
        <WorkImg src='1.webp' />
      </RowContainer>
      <RowContainer>
        <WorkVid src='1.webm' />
        <WorkVid src='2.webm' />
      </RowContainer>
      <RowContainer toolTip={
        <>
          <p>
            <b>Top:</b> secondary stylus;
            <br />
            <b>Bottom:</b> primary stylus;
          </p>
          <p>Due to the simultaneity with which both styluses write, there is no clear logical order: the letterform is derived from the gesture as much as the gesture is derived from the letterform. The consequent mark-making system investigates the relationship between the two.</p>
        </>
      }>
        <WorkImg src='2.webp' />
        <WorkImg src='3.webp' />
        <WorkImg src='4.webp' />
      </RowContainer>
      <RowContainer toolTip={<p>A simulated recreation of the pantograph in-use with a flat-tipped marker. In this configuration, marks made with the primary stylus will be replicated at a size ratio of <b>2:1</b>. With the physical tool, the placement of the secondary holder can be changed to modify the <b>scale, proportion, and slant</b> of the output.</p>}>
        <CanvasPlaceholder ref={placeholderRef}>
          <CanvasCaption>DEMO - Drawing Area</CanvasCaption>
          <ClearButton onClick={handleClear}> CLEAR </ClearButton>
        </CanvasPlaceholder>
      </RowContainer>
      <RowContainer>
        <VideoIframe
          type={VideoIframeType.Youtube}
          src='Xt4DlydwnO4'
          aspectRatio='14 / 9'
          title='STROKE Demo' />
      </RowContainer>
      <RowContainer>
        {cardRefs.map((ref, i) => <WorkImg
          key={i}
          ref={ref}
          src={`hover/${i + (hoveringCard === i ? 3 : 0) + 1}.webp`}
          onMouseOver={() => handleOnHover(i, true)}
          onMouseOut={() => handleOnHover(i, false)} />)}
      </RowContainer>
      <WorkImgGroup grid={[4, 3]} prefix='outputs' />
    </>
  )
}

const CanvasPlaceholder = styled.div`
${mixins
    .chain()
    .noSelect()
    .flex('initial', 'space-between')}
  width: 100%;
  aspect-ratio: 2 / 1;
  font-size: ${fontSizes.workPageStroke.caption.css};
  font-weight: ${fontParams.semiBold};
  color: ${colors.strokeCaption};

  > p, button {
    margin: 1em;
    height: fit-content;
  }
`

const CanvasCaption = styled.p` 
  pointer-events: none;
`

const ClearButton = styled.button`
  cursor: pointer;
  color: ${colors.strokeClear};
  border: ${domSizes.workPageStroke.button.border.css} solid ${colors.strokeClear};
  padding: 0.5em;
  border-radius: ${domSizes.workPageStroke.button.borderRadius.css};

  &:hover {
    color: ${colors.activeElem};
    border-color: ${colors.activeElem};
  }
`


export default PageStroke
