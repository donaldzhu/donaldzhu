import { useLocation } from 'react-router-dom'
import { styled } from 'styled-components'
import Anchor from '../common/anchor'
import { em } from '../../utils/styleUtils'
import mixins from '../../styles/mixins'
import { fontSizes } from '../../styles/fonts'
import colors from '../../styles/colors'

const WorkSideBarItem = ({ data, isHighlighted, highlightedRef, handleHover }) => {
  const { title, abbr, tags, id } = data
  const location = useLocation()
  return (
    <ItemContainer $isHighlighted={isHighlighted}>
      <LinkContainer
        to={`${location.pathname}/${id}`}
        ref={isHighlighted ? highlightedRef : null}
        onMouseOver={() => handleHover(title)} >
        <Title>{abbr || title}</Title>
        <ItemDelimiter>●</ItemDelimiter>
        <p>{tags.join(' + ')}</p>
      </LinkContainer>
    </ItemContainer>
  )
}

const LinkContainer = styled(Anchor)`
  ${mixins.noSelect()} 
  display: inline;
  line-height: ${fontSizes.textLineHeight};
  letter-spacing: -0.005em;
`

const negativeIndent = em(1.5)
const ItemContainer = styled.li`
  font-size: ${fontSizes.workIndex};
  color: ${({ $isHighlighted }) => $isHighlighted ? colors.activeElem : colors.workIndex};
  position: relative;
  left: ${negativeIndent};
  text-indent: -${negativeIndent};
`

const ItemDelimiter = styled.span`
  margin: 0 0.4em;
`

const Title = styled.h3`
  font-size: ${fontSizes.workIndexSans};
  display: inline;
`


export default WorkSideBarItem