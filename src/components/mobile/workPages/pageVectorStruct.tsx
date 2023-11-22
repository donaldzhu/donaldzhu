import { useRef, useState } from 'react'
import styled from 'styled-components'
import Anchor from '../../common/anchor'
import WorkImg from '../../common/media/workImg'
import WorkVid from '../../common/media/workVid'
import RowContainer from '../../common/rowContainer'
import SmallText from '../../common/styled/smallText'
import TextContainer from '../../common/styled/textContainer'
import { ReactComponent as CSvg } from '../../../assets/mobile/work/vector-struct/c.svg'
import { ReactComponent as ESvg } from '../../../assets/mobile/work/vector-struct/e.svg'
import { ReactComponent as OSvg } from '../../../assets/mobile/work/vector-struct/o.svg'
import { ReactComponent as RSvg } from '../../../assets/mobile/work/vector-struct/r.svg'
import { ReactComponent as TSvg } from '../../../assets/mobile/work/vector-struct/t.svg'
import { ReactComponent as VSvg } from '../../../assets/mobile/work/vector-struct/v.svg'
import mixins from '../../../styles/mixins'
import { percent } from '../../../utils/sizeUtils'
import WorkImgGroup from '../../common/media/workImgGroup'
import useCanvas from '../../../hooks/useCanvas'
import drawElemBorders from '../../../p5/sketches/drawElemBorders'
import { sketchSizes } from '../../../styles/sizes'
import ColumnContainer from '../../common/styled/columnContainer'
import type { WorkPageContentProps } from '../work/workPageTypes'


const PageVectorStruct = ({ WorkInfo }: WorkPageContentProps) => {
  const [displayedGlyph, setDisplayedGlyph] = useState(0)
  const displayedGlyphRef = useRef<SVGSVGElement>(null)

  const glyphs = 'vector'
  const VectorSvgs = [VSvg, ESvg, CSvg, TSvg, OSvg, RSvg]

  const handleClick = (i: number) => setDisplayedGlyph(i)
  useCanvas(() => drawElemBorders({
    elemRefs: [displayedGlyphRef],
    padding: sketchSizes.mobile.struct.padding
  }))

  return (
    <>
      <RowContainer>
        <WorkImg src='1.webp' />
      </RowContainer>
      <WorkInfo />
      <TextContainer>
        <SmallText>(Part of my <Anchor to='../vector-spin-stroke'>investigation on tools</Anchor>).</SmallText>
        <SmallText>
          The 3D iteration of <i><Anchor to='../vector-string'>VECTOR-STRING</Anchor>:</i> an assortment of physical letters whose
          sides are connected by elastic fabrics.
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
      <RowContainer>
        <WorkVid src='1.mp4' />
      </RowContainer>
      <RowContainer>
        <WorkImg src='2.webp' />
      </RowContainer>
      <TextContainer>
        <SmallText>
          <i>
            Through its material resistance, it provides kinaesthetic feedback to
            specific actions (rotation, displacement) and intrinsic typographic properties
            (min-max distances, weight, contrast, etc.).
          </i>
        </SmallText>
      </TextContainer>
      <SvgOuterContainer>
        {VectorSvgs.map((Svg, i) =>
          <Svg
            key={i}
            ref={i === displayedGlyph ? displayedGlyphRef : null}
            onClick={() => handleClick(i)} />)}
      </SvgOuterContainer>
      <RowContainer>
        <WorkVid src={`${displayedGlyph + 2}.mp4`} width={percent(80)} key={displayedGlyph} />
      </RowContainer>
      <WorkImgGroup grid={[3, 2]} prefix={glyphs[displayedGlyph]} />
      <TextContainer>
        <SmallText>
          <i>
            The resulting formal studies are an iterative, embodied process
            of unearthing vector relations within physical typographic forms.
          </i>
        </SmallText>
      </TextContainer>
      <RowContainer>
        <WorkImg src='3.webp' />
      </RowContainer>
      <RowContainer cols={[1, 2]}>
        <ColumnContainer>
          <WorkImg src='4.webp' />
          <WorkImg src='5.webp' />
        </ColumnContainer>
        <WorkVid src='8.mp4' />
      </RowContainer>
      <WorkImgGroup grid={[3, 2]} prefix='g' />
      <TextContainer>
        <SmallText>
          <b>Varied Forms G/S</b> — using different letterforms for the two
          connected glyphs; it not only adds another layer to
          the system but also emulates the non-parallel nature of handwriting.
        </SmallText>
      </TextContainer >
      <RowContainer cols={[1, 2]}>
        <ColumnContainer>
          <WorkImg src='6.webp' />
          <WorkImg src='7.webp' />
        </ColumnContainer>
        <WorkVid src='9.mp4' />
      </RowContainer>
      <WorkImgGroup grid={[3, 2]} prefix='s' />
    </>
  )
}


const SvgOuterContainer = styled.div`
  ${mixins.flex('flex-end', 'space-evenly')}

  svg {
    flex: none;
    width: 15%;
    height: fit-content;

    &,
    _::-webkit-full-page-media,
    _:future {
      height: intrinsic;
    }
  }
`


export default PageVectorStruct
