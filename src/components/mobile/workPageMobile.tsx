import styled from 'styled-components'
import { WorkDataInterface } from '../work/workTypes'
import { fontLineHeights, fontParams, fontSizes } from '../../styles/fonts'
import { domSizes } from '../../styles/sizes'
import workDescriptions from '../../data/work/workDescriptions.json'
import mixins from '../../styles/mixins'
import { capitalize } from '../../utils/commonUtils'
import TextContainer from '../common/styled/textContainer'
import { parseHtml } from '../../utils/reactUtils'
import Media from '../common/media/media'
import { MediaFileType } from '../../utils/helpers/preloader/preloadUtils'

// TODO
interface WorkPageProps {
  data: WorkDataInterface
  Content: () => JSX.Element
}

const typedWorkDescriptions: Record<string, string> = workDescriptions
const WorkPageMobile = ({ data, Content }: WorkPageProps) => {
  const { title, date, tags, medium, id } = data

  return (
    <Container>
      {/* <BannerContainer>
        <Media src={`assets/_mobile_test/banner/${id}.webp`} type={MediaFileType.Image} />
      </BannerContainer> */}
      <div>
        <Title>{title}</Title>
        <Details>
          <p>{date}</p>
          <p>{capitalize(tags.join('/').toLocaleLowerCase())}</p>
          <p>{capitalize(medium.join(', ').toLocaleLowerCase())}</p>
        </Details>
      </div>
      <TextContainer>{parseHtml(typedWorkDescriptions[id])}</TextContainer>
    </Container>
  )
}

const Container = styled.div`
  ${mixins.mobileBody()}
  position: absolute;
  top: ${domSizes.mobile.app.top.css};
`

const BannerContainer = styled.div`
  img, video {
    width: 100%;
  }
`

const Title = styled.h1`
  margin-top: 0.75rem;
  font-size: 1.45rem !important; // TODO
`

const Details = styled.div`
  font-size: 0.8rem;
  line-height: ${fontLineHeights.text};
  margin: ${domSizes.desktop.text.innerMargin.css} 0;
  font-weight: ${fontParams.demiBold};

  :first-child{
    ${mixins.fontVar({ MONO: 1 })};
  }
`

export default WorkPageMobile