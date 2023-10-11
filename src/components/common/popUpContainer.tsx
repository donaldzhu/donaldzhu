import { HTMLAttributes, ReactNode, useEffect } from 'react'
import styled from 'styled-components'
import mixins from '../../styles/mixins'
import colors from '../../styles/colors'
import { fontLineHeights } from '../../styles/fonts'

interface PopUpContainerProps {
  className?: string,
  children?: ReactNode,
  props?: HTMLAttributes<HTMLDivElement>[]
}

const PopUpContainer = ({ className, children, ...props }: PopUpContainerProps) => {
  useEffect(() => {
    const { style } = document.body
    style.overflow = 'hidden'

    return () => { style.overflow = '' }
  }, [])

  return (
    <Container className={className} {...props}>
      {children}
    </Container>
  )
}

const Container = styled.div`
  ${mixins
    .chain()
    .fixed()
    .fullscreen()
    .flex('center', 'center')
    .highZIndex(5)}
  text-align: center;
  color: ${colors.popUpColor};

  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p {
    font-weight: normal;
    line-height: ${fontLineHeights.popUp};
    text-transform: initial;
    hyphens: none;
  }
`

export default PopUpContainer