import { useRef, useState } from 'react'
import styled from 'styled-components'
import { ReactComponent as CSvg } from '../../assets/work/vector-struct/c.svg'
import { ReactComponent as ESvg } from '../../assets/work/vector-struct/e.svg'
import { ReactComponent as OSvg } from '../../assets/work/vector-struct/o.svg'
import { ReactComponent as RSvg } from '../../assets/work/vector-struct/r.svg'
import { ReactComponent as TSvg } from '../../assets/work/vector-struct/t.svg'
import { ReactComponent as VSvg } from '../../assets/work/vector-struct/v.svg'
import useCanvas from '../../hooks/useCanvas'
import drawElemBorders from '../../p5/sketches/drawElemBorders'
import mixins from '../../styles/mixins'
import WorkImg from '../common/media/workImg'
import WorkImgGroup from '../common/media/workImgGroup'
import WorkVid from '../common/media/workVid'
import RowContainer from '../common/rowContainer'
import ColumnContainer from '../common/styled/columnContainer'

const PageVectorStruct = () => {
  const [displayedGlyph, setDisplayedGlyph] = useState(0)
  const displayedGlyphRef = useRef<SVGSVGElement>(null)

  const glyphs = 'vector'
  const VectorSvgs = [VSvg, ESvg, CSvg, TSvg, OSvg, RSvg]

  const handleClick = (i: number) => setDisplayedGlyph(i)
  useCanvas(() => drawElemBorders({ elemRefs: [displayedGlyphRef] }))

  return (
    <>
      <RowContainer>
        <WorkImg src='1.webp' />
        <WorkImg src='2.webp' />
      </RowContainer>
      <RowContainer toolTip={
        <p>
          <b>Open-back A</b> — this glyph only has one of its ends attached to a wooden letter,
          making its behavior more akin to that of a flag through swaying motions.
          As such, physical forces, such as drag and gravity, also play a role in its performance.
        </p>
      }>
        <WorkVid src='1.webm' />
      </RowContainer>
      <RowContainer>
        <WorkImg src='3.webp' />
      </RowContainer>
      <SvgOuterContainer>
        {VectorSvgs.map((Svg, i) =>
          <Svg
            key={i}
            ref={i === displayedGlyph ? displayedGlyphRef : null}
            onClick={() => handleClick(i)} />)}
      </SvgOuterContainer>
      <RowContainer>
        <ColumnContainer>
          <WorkImgGroup grid={[3, 3]} prefix={glyphs[displayedGlyph]} />
        </ColumnContainer>
        <WorkVid src={`${displayedGlyph + 4}.webm`} key={displayedGlyph}
          onChange={console.log} />
      </RowContainer>
      <RowContainer>
        <WorkImg src='4.webp' />
      </RowContainer>
      <RowContainer cols={[1, 2]} toolTip={
        <p>
          <b>Varied Forms G/S</b> — using slightly different letterforms for the two
          connected glyphs. Not only does varying this parameter add another layer to
          the system, but it sometimes also emulates the non-parallel nature of handwriting.
        </p>
      }>
        <ColumnContainer>
          <WorkImg src='5.webp' />
          <WorkImg src='6.webp' />
        </ColumnContainer>
        <WorkVid src='2.webm' />
      </RowContainer>
      <WorkImgGroup grid={[3, 2]} prefix='g' />
      <RowContainer cols={[1, 2]}>
        <ColumnContainer>
          <WorkImg src='7.webp' />
          <WorkImg src='8.webp' />
        </ColumnContainer>
        <WorkVid src='3.webm' />
      </RowContainer>
      <WorkImgGroup grid={[3, 2]} prefix='s' />
    </>
  )
}

const SvgOuterContainer = styled.div`
  ${mixins
    .chain()
    .innerMargin('4px', 'left')
    .flex('flex-end', 'initial')}

    svg {
      cursor: pointer;
      flex: none;
      width: 12.5%;
      height: fit-content;
    }


`


export default PageVectorStruct
