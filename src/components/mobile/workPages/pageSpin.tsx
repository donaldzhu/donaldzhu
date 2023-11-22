import Anchor from '../../common/anchor'
import { VideoIframeType } from '../../common/media/mediaTypes'
import VideoIframe from '../../common/media/videoIframe'
import WorkImg from '../../common/media/workImg'
import WorkImgGroup from '../../common/media/workImgGroup'
import WorkVid from '../../common/media/workVid'
import RowContainer from '../../common/rowContainer'
import SmallText from '../../common/styled/smallText'
import TextContainer from '../../common/styled/textContainer'
import type { WorkPageContentProps } from '../work/workPageTypes'

const PageSpin = ({ WorkInfo }: WorkPageContentProps) => {
  return (
    <>
      <RowContainer>
        <WorkVid src='1.mp4' />
      </RowContainer>
      <WorkInfo />
      <TextContainer>
        <SmallText>(Part of my <Anchor to='../vector-spin-stroke'>investigation on tools</Anchor>).</SmallText>
        <SmallText>
          <i>SPIN</i> is a cylindrical, multi-layered, motorized type-rotation
          device. It is interested in investigating optics and the ways in
          which type physically appears. By intersecting typography with
          related areas of concern, such as occlusion, motion, and topology,
          the resulting outputs are studies of how typography oscillates between
          recognition and obfuscation.
        </SmallText>
      </TextContainer>
      <RowContainer>
        <WorkImg src='1.webp' />
      </RowContainer>
      <RowContainer >
        <WorkImg src='2.webp' />
      </RowContainer>
      <RowContainer cols={[1, 2]}>
        <WorkVid src='2.mp4' />
        <WorkImg src='3.webp' />
      </RowContainer>
      <TextContainer>
        <SmallText>
          This apparatus consists of mostly 3D-printed parts, which are
          driven by four separate mechanical motors. Prints (i.e. acetates,
          stencils) can be inserted into the holders at the base of the
          cylinders, allowing the inputs of the system to be variable.
        </SmallText>
      </TextContainer>
      <RowContainer>
        <VideoIframe
          type={VideoIframeType.Youtube}
          src='tTNSkb7iunw'
          title='SPIN Demo' />
      </RowContainer>
      <WorkImgGroup grid={[3, 4]} prefix='outputs' />
    </>
  )
}


export default PageSpin
