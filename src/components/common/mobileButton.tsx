import { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from 'react'
import styled from 'styled-components'

type MobileChildrenProps = {
  children: ReactNode
} & DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>

const MobileButton = ({ children, ...props }: MobileChildrenProps) => {
  return (
    <Button {...props}>
      <button onClick={() => { }}></button>
      {children}
    </Button>
  )
}

const Button = styled.button`
  
`

export default MobileButton