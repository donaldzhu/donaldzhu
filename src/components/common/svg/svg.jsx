const Svg = ({ w, h, children }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}>
      {children}
    </svg>
  )
}

export default Svg