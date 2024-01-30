import styled from 'styled-components'
import usePortfolioQuery from '../../../hooks/usePortfolioQuery'
import useSidebar from '../../../hooks/useSidebar'
import Anchor from '../../common/anchor'
import Text from '../../common/styled/text'
import TextContainer from '../../common/styled/textContainer'
import pdfPortfolioData from '../../../data/pdf-portfolio.json'

const Home = () => {
  useSidebar(<HomeSidebar />)
  return undefined
}

const HomeSidebar = () => {
  const { pid, portfolioData } = usePortfolioQuery()

  const PortfolioHeader = portfolioData ?
    `${portfolioData.toLocaleUpperCase()}, WELCOME!` :
    'DONALD ZHU is a graphic designer based in Toronto, Canada.'

  const pdfLink = pid ? (pdfPortfolioData as Record<string, string>)[pid.toLowerCase()] : null
  const PortfolioHeaderSuffix = pdfLink ?
    <PdfSpan>
      Please <Anchor to={pdfLink}>click here</Anchor> for a curated PDF portfolio.
    </PdfSpan> :
    <>Thanks for your time.</>

  return (
    <TextContainer>
      <Text>
        <b>{PortfolioHeader}{pdfLink ? PortfolioHeaderSuffix : null}</b>
      </Text>
      <Text>
        {portfolioData ?
          <>Donald Zhu is a designer based in Toronto. He finished at OCAD U as the <Anchor to='https://eportfolio.ocadu.ca/exhibitor/details/b75b45af-1ace-4d75-bdd0-bb9afa12cea8' target='_blank'>medal winner</Anchor> of 2023. His work focuses on <i>typography, interaction, and code</i>. In his free time, he likes to work on typefaces and web projects.</> :
          <>
            He finished his degree at OCAD University in 2023. His work primarily focuses on
            <i> typography, interaction, and code</i>. In his free time, he likes to work on
            custom typefaces and side web projects.
          </>}
      </Text>
    </TextContainer>
  )
}

const PdfSpan = styled.span`
  display: block;
`

export default Home