import { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import usePortfolioQuery from '../../hooks/usePortfolioQuery'
import colors from '../../styles/colors'
import { appendQuery, validateString } from '../../utils/commonUtils'
import { desktopQuery } from '../../utils/queryUtil'
import type { LinkProps } from 'react-router-dom'

const Anchor = forwardRef<HTMLAnchorElement, LinkProps & { noQuery?: boolean }>(function Anchor({
  to,
  target,
  noQuery,
  ...props
}, ref) {
  const linkIsExternal = to && typeof to === 'string' && to.match(/^(https|www)/)
  const { pid } = usePortfolioQuery()

  target ||= (linkIsExternal ? '_blank' : '_self')
  to += `${validateString(
    (pid && !linkIsExternal && !noQuery),
    appendQuery(['pid', pid])
  )}`

  return <HoverLink
    {...props}
    ref={ref}
    to={to}
    target={target}
    rel='noreferrer' />
})

const HoverLink = styled(Link)`
  @media ${desktopQuery} {
    &:hover {
      color:${colors.activeElem};
    }
  }
`

export default Anchor