import Anchor from '../../common/anchor'
import { VideoIframeType } from '../../common/media/mediaTypes'
import VideoIframe from '../../common/media/videoIframe'
import WorkImg from '../../common/media/workImg'
import WorkImgGroup from '../../common/media/workImgGroup'
import WorkVid from '../../common/media/workVid'
import RowContainer from '../../common/rowContainer'
import SmallText from '../../common/styled/smallText'
import TextContainer from '../../common/styled/textContainer'
import { WorkPageMobileContentProps } from '../workPageTypes'

const PageStrokeMobile = ({ WorkInfo }: WorkPageMobileContentProps) => {
  return (
    <>
      <RowContainer>
        <WorkImg src='1.webp' />
      </RowContainer>
      <WorkInfo />
      <TextContainer>
        <SmallText>(Part of my <Anchor to='../vector-spin-stroke'>investigation on tools</Anchor>).</SmallText>
        <SmallText>
          <i>STROKE</i> uses the <Anchor to='https://en.wikipedia.org/wiki/Pantograph'>pantograph</Anchor> mechanism
          to translate writing gestures through different styluses. The primary holder
          uses a pencil, while the secondary holder can be adapted with any drawing instrument.
          As one end moves, the other follows—it is an encoded replication system that outputs
          marks with different qualities based on the same letterform,
          depending on the nature of the stylus.
        </SmallText>
      </TextContainer>
      <RowContainer>
        <WorkVid src='1.mp4' />
      </RowContainer>
      <TextContainer>
        <SmallText>
          As such, it explores the historically significant connection between styluses,
          styles, glyph systems, and languages.
        </SmallText>
      </TextContainer>
      <RowContainer>
        <WorkImg src='2 2.webp' />
      </RowContainer>
      <RowContainer>
        <WorkImg src='3.webp' />
      </RowContainer>
      <TextContainer>
        <SmallText>
          Due to the simultaneity with which both styluses write, there is no
          clear logical order: the letterform is derived from the gesture as
          much as the gesture is derived from the letterform.
        </SmallText>
      </TextContainer>
      <RowContainer>
        <VideoIframe
          type={VideoIframeType.Youtube}
          src='Xt4DlydwnO4'
          aspectRatio='14 / 9'
          title='STROKE Demo' />
      </RowContainer>
      <RowContainer>
        <WorkVid src='hover.mp4' />
      </RowContainer>
      <WorkImgGroup grid={[2, 5]} prefix='outputs' />
    </>
  )
}

export default PageStrokeMobile
