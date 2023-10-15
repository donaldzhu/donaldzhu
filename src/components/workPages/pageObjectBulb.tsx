import RowContainer from '../common/rowContainer'
import WorkImg from '../common/media/workImg'
import WorkImgGroup from '../common/media/workImgGroup'


const PageObjectBulb = () => {
  const smallImgZoomSize = 0.85
  return (
    <>
      <RowContainer toolTip='Afterimages created with various parts of the lightbulbs using blue and orange cyanotypes.'>
        <WorkImg src='1.webp' />
        <WorkImg src='2.webp' />
      </RowContainer>
      <RowContainer>
        <WorkImg src='3.webp' />
        <WorkImg src='4.webp' />
        <WorkImg src='5.webp' />
      </RowContainer>
      <RowContainer>
        <WorkImg src='6.webp' />
        <WorkImg src='7.webp' />
      </RowContainer>
      <WorkImgGroup
        grid={[3, 3]}
        prefix='spray-paint'
        toolTip='Spray painted partial negatives of the lightbulbs blending into/overlaying on top of one another.'
        props={{ maxSize: smallImgZoomSize }} />
      <RowContainer toolTip='High contrast, long exposure photography of individual lightbulbs.' >
        <WorkImg src='8.webp' />
        <WorkImg src='9.webp' />
      </RowContainer>
      <RowContainer>
        <WorkImg src='10.webp' />
        <WorkImg src='11.webp' />
      </RowContainer>
    </>
  )
}


export default PageObjectBulb