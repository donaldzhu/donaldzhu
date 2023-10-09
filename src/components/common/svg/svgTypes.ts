import { SVGProps } from 'react'

export type SvgPropsType = {
  w: number,
  h: number,
  children: JSX.Element | JSX.Element[],
  props: SVGProps<SVGSVGElement>
}