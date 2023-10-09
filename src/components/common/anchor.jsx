import { Link } from 'react-router-dom'
import usePortfolioQuery from '../../hooks/usePortfolioQuery'
import { forwardRef } from 'react'
import styled from 'styled-components'
import colors from '../../styles/colors'
import { appendQuery } from '../../utils/commonUtils.ts'

const Anchor = forwardRef(function Anchor({ to, target, noQuery, ...props }, ref) {
  const linkIsExternal = to && to.match(/^(https|www)/)
  const { pid } = usePortfolioQuery()

  target ||= (linkIsExternal ? '_blank' : '_self')
  to += `${pid && !linkIsExternal && !noQuery ? appendQuery(['pid', pid]) : ''}`

  return <HoverLink
    {...props}
    ref={ref}
    to={to}
    target={target}
    rel='noreferrer' />
})

const HoverLink = styled(Link)`
    &:hover {
    color:${colors.activeElem}; 
  }
`

export default Anchor