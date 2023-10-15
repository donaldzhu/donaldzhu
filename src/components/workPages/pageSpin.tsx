import { VideoIframeType } from '../common/media/mediaTypes'
import VideoIframe from '../common/media/videoIframe'
import WorkImg from '../common/media/workImg'
import WorkImgGroup from '../common/media/workImgGroup'
import WorkVid from '../common/media/workVid'
import RowContainer from '../common/rowContainer'


const PageSpin = () => {
  return (
    <>
      <RowContainer cols={[2, 1]}>
        <WorkImg src='1.webp' />
        <WorkVid src='1.webm' />
      </RowContainer>
      <RowContainer toolTip={
        <>
          <p>
            This apparatus consists of mostly 3D-printed parts.
            Driven by separate mechanical motors, the four cylinders
            in the center can rotate independently.
          </p>
          <RowContainer>
            <WorkImg src='1.webp' isToolTip />
            <WorkImg src='2.webp' isToolTip />
          </RowContainer>
        </>
      }>
        <WorkImg src='2.webp' />
      </RowContainer>
      <RowContainer toolTip='Previously unthought-of material conditions of typography are revealed through the documentation of the tool: aperture, shutter speed, reflection, inter-layer shadows, backlight diffusion, and print type — real-life challenges that affect the legibility of type and communication.'>
        <VideoIframe
          type={VideoIframeType.Youtube}
          src='tTNSkb7iunw'
          title='SPIN Demo' />
      </RowContainer>
      <RowContainer cols={[1, 2]} toolTip={
        <>
          <p>
            Prints (i.e. acetates, stencils) can be inserted into the holders at the
            base of the cylinders, allowing the inputs of the system to be variable.
          </p>
          <WorkImg src='3.webp' isToolTip />
          <p>
            Similarly, changing the number of rolls and their rotation cycles make the
            outputs combinatoric and multiplicative.
          </p>
        </>
      }>
        <WorkVid src='2.webm' />
        <WorkImg src='3.webp' />
      </RowContainer >
      <WorkImgGroup
        grid={[4, 4]}
        prefix='outputs'
        toolTip={
          <>
            <p>
              <b>Combinatorics</b> — combining Chinese radicals cyclically
              to make existent and non-existent characters.
            </p>
            <p>
              <b>Occlusion</b> — physically obscuring typography under
              different lighting and optical conditions.
            </p>
            <p>
              <b>Halation</b> — using different backlighting to affect the legibility
              of type in motion; relevant for highway signages and people with astigmatism.
            </p>
          </>
        } />
    </>
  )
}


export default PageSpin
