import WorkImg from '../common/media/workImg'
import WorkImgGroup from '../common/media/workImgGroup'
import RowContainer from '../common/rowContainer'
import ColumnContainer from '../common/styled/columnContainer'


const PageAcogito = () => {
  return (
    <>
      <RowContainer>
        <WorkImg src='1.webp' />
      </RowContainer>
      <RowContainer cols={[2, 3]}>
        <WorkImg src='2.webp' />
        <WorkImg src='3.webp' />
      </RowContainer>
      <RowContainer>
        <WorkImg src='22.webp' />
      </RowContainer>
      <RowContainer cols={[3, 1]} toolTip='A three-page translucent diagram detailing the three layers within the Neurelium structures: centralized, distributed, and individual.'>
        <WorkImg src='4.webp' />
        <ColumnContainer>
          <WorkImg src='5.webp' />
          <WorkImg src='6.webp' />
          <WorkImg src='7.webp' />
          <WorkImg src='8.webp' />
          <WorkImg src='9.webp' />
        </ColumnContainer>
      </RowContainer>
      <RowContainer>
        <WorkImg src='23.webp' />
      </RowContainer>
      <RowContainer cols={[1, 2]} toolTip='A draft of an illustrated proposal for the network chronicled by its hypothetical lead researcher. It delineates the historical development of Acogito from a first-person perspective, from its conception to its widespread adaptation.'>
        <WorkImg src='10.webp' />
        <WorkImg src='11.webp' />
      </RowContainer>
      <RowContainer>
        <WorkImg src='12.webp' />
        <WorkImg src='13.webp' />
        <WorkImg src='14.webp' />
      </RowContainer>
      <RowContainer>
        <WorkImg src='24.webp' />
      </RowContainer>
      <RowContainer toolTip='Four networked information structures that served as references for researchers. Neurons, mycelium, and internet—the three of which synthesized to create the fourth, the Neurelium structure, in a human-fungus-machine synthesis.'>
        <WorkImg src='15.webp' />
      </RowContainer>
      <RowContainer >
        <WorkImg src='16.webp' />
        <WorkImg src='17.webp' />
      </RowContainer>
      <RowContainer>
        <WorkImg src='18.webp' />
        <WorkImg src='19.webp' />
      </RowContainer>
      <RowContainer>
        <WorkImg src='25.webp' />
      </RowContainer>
      <RowContainer toolTip={
        <>
          <p>Alongside other graphics of network structures in this project, the deck of transparencies is the generative output of my program in p5.js. The logic is borrowed from <a href='https://ciphrd.com/2021/03/17/pattern-formation-using-dividing-aggregating-walkers/'>Ciphrd’s dividing-aggregating walkers</a>—the appearance of which heavily resembles mycelial structures.</p>
          <WorkImg src='1.gif' isToolTip />
        </>
      }>
        <WorkImg src='20.webp' />
      </RowContainer>
      <WorkImgGroup grid={[3, 3]} prefix='transparencies' />
      <RowContainer>
        <WorkImg src='26.webp' />
      </RowContainer>
      <RowContainer toolTip='An early 24" x 48" poster diagram that illustrates how individual users are attached to the Neurelium system while sustaining their bodily functions.'>
        <WorkImg src='21.webp' />
      </RowContainer>
    </>
  )
}

export default PageAcogito