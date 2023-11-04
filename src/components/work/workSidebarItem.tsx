import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import colors from '../../styles/colors'
import { fontLineHeights, fontSizes } from '../../styles/fonts'
import mixins from '../../styles/mixins'
import { em } from '../../utils/sizeUtils'
import Anchor from '../common/anchor'
import { WorkAnchorProps } from './workTypes'

interface StyledItemContainerProps {
  $isHighlighted: boolean
}

const WorkSideBarItem = ({ data, isHighlighted, highlightedRef, handleHover }: WorkAnchorProps) => {
  const { title, abbr, tags, id } = data
  const location = useLocation()
  return (
    <ItemContainer $isHighlighted={isHighlighted}>
      <LinkContainer
        to={`${location.pathname}/${id}`}
        ref={isHighlighted ? highlightedRef : null}
        onMouseOver={() => handleHover(title)} >
        <Title>{abbr ?? title}</Title>
        <ItemDelimiter>●</ItemDelimiter>
        <p>{tags.join(' + ')}</p>
      </LinkContainer>
    </ItemContainer>
  )
}

const LinkContainer = styled(Anchor)`
  ${mixins.noSelect()}
  display: inline;
  line-height: ${fontLineHeights.text};
  letter-spacing: -0.005em;
`

const negativeIndent = em(1.5)
const ItemContainer = styled.li<StyledItemContainerProps>`
  font-size: ${fontSizes.desktop.workIndex.mono.css};
  color: ${({ $isHighlighted }) => $isHighlighted ? colors.activeElem : colors.workIndex};
  position: relative;
  left: ${negativeIndent};
  text-indent: -${negativeIndent};
`

const ItemDelimiter = styled.span`
  margin: 0 0.4em;
`

const Title = styled.h3`
  font-size: ${fontSizes.desktop.workIndex.sans.css};
  display: inline;
`


export default WorkSideBarItem