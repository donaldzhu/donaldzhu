import { SvgPropsType } from './svgTypes'

const Svg = ({ w, h, children, ...props }: SvgPropsType) => {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}>
      {children}
      <line></line>
    </svg>
  )
}

export default Svg