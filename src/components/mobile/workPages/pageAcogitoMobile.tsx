import Anchor from '../../common/anchor'
import WorkImg from '../../common/media/workImg'
import WorkVid from '../../common/media/workVid'
import RowContainer from '../../common/rowContainer'
import SmallText from '../../common/styled/smallText'
import TextContainer from '../../common/styled/textContainer'
import { WorkPageMobileContentProps } from '../workPageTypes'


const PageAcogitoMobile = ({ WorkInfo }: WorkPageMobileContentProps) => {
  return (
    <>
      <RowContainer>
        <WorkImg src='mobile-1.webp' />
      </RowContainer>
      <WorkInfo />
      <TextContainer>
        <SmallText>
          A speculative design project about a new drug in a hypothetical future.
          Via its effects and the assistance of machines and fungi, human users’
          consciousness dissolves to form a <Anchor to='https://en.wikipedia.org/wiki/Mycelium'>mycelium-like</Anchor>, distributed network,
          wherein they act as individual hypha — meat-based AIs — to lend their
          computational power to nature symbiotically. As such, the speculative
          concepts surrounding this drug seek to offer us narratives to provide
          thoughtful critiques about our current conditions.
        </SmallText>
      </TextContainer>
      <RowContainer cols={[2, 3]}>
        <WorkImg src='2.webp' />
        <WorkImg src='3.webp' />
      </RowContainer>
      <RowContainer>
        <WorkImg src='4.webp' />
      </RowContainer>
      <RowContainer>
        <WorkVid src='1.mp4' />
      </RowContainer>
      <TextContainer>
        <SmallText>
          A three-layer translucent diagram of the layers within the Neurelium
          structures: centralized, distributed, and individual.
        </SmallText>
      </TextContainer>
      <RowContainer cols={[1, 2]}>
        <WorkImg src='10.webp' />
        <WorkImg src='11.webp' />
      </RowContainer>
      <RowContainer>
        <WorkImg src='13.webp' />
      </RowContainer>
      <RowContainer>
        <WorkImg src='14.webp' />
        <WorkImg src='14 2.webp' />
      </RowContainer>
      <TextContainer>
        <SmallText>
          A draft of an illustrated proposal for the network chronicled by its
          hypothetical lead researcher. It delineates the historical development
          of Acogito from a first-person perspective.
        </SmallText>
      </TextContainer>
      <RowContainer>
        <WorkImg src='15.webp' />
      </RowContainer>
      <RowContainer>
        <WorkImg src='16.webp' />
        <WorkImg src='17.webp' />
      </RowContainer>
      <RowContainer>
        <WorkImg src='18.webp' />
        <WorkImg src='19.webp' />
      </RowContainer>
      <TextContainer>
        <SmallText>
          Four networked information structures: Neurons, mycelium, and internet—the three of which
          synthesized to create the fourth, the Neurelium structure, in a
          human-fungus-machine synthesis.
        </SmallText>
      </TextContainer>
      <RowContainer>
        <WorkImg src='20.webp' />
      </RowContainer>
      <RowContainer>
        <WorkVid src='mobile-2.mp4' />
      </RowContainer>
      <RowContainer>
        <WorkImg src='transparencies/1.webp' />
        <WorkImg src='transparencies/8.webp' />
      </RowContainer>
      <RowContainer>
        <WorkImg src='transparencies/3.webp' />
        <WorkImg src='transparencies/4.webp' />
      </RowContainer>
      <RowContainer>
        <WorkImg src='transparencies/5.webp' />
        <WorkImg src='transparencies/6.webp' />
      </RowContainer>
      <RowContainer>
        <WorkImg src='transparencies/7.webp' />
        <WorkImg src='transparencies/8.webp' />
      </RowContainer>
      <TextContainer>
        <SmallText>
          Alongside other graphics of network structures in this project, this deck of transparencies is the generative output of my program in p5.js. The logic is borrowed from <Anchor to='https://ciphrd.com/2021/03/17/pattern-formation-using-dividing-aggregating-walkers/'>Ciphrd’s dividing-aggregating walkers</Anchor>—the appearance of which heavily resembles mycelial structures.
        </SmallText>
      </TextContainer>
      <RowContainer>
        <WorkImg src='21.webp' />
      </RowContainer>
      <TextContainer>
        <SmallText>
          An early 24" x 48" poster diagram that illustrates how individual
          users are attached to the Neurelium system.
        </SmallText>
      </TextContainer>
    </>
  )
}

export default PageAcogitoMobile