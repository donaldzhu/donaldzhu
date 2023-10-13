import Text from '../helpers/vector/text'
import ElemRect from '../../utils/helpers/rect/elemRect'
import configs from '../configs/vector'
import { MutableRefObject } from 'react'
import { validateRef } from '../../utils/typeUtils'
import p5 from 'p5'
import Size from '../../utils/helpers/size'

interface DrawVectorStringProps {
  containerRef: MutableRefObject<HTMLDivElement | null>
  placeholderRef: MutableRefObject<HTMLDivElement | null>
}


const drawVectorString = ({ containerRef, placeholderRef }: DrawVectorStringProps) => {
  if (!validateRef(placeholderRef) || !validateRef(containerRef))
    throw new Error('Vector string has no placeholder or container ref.')

  let text: Text
  const TEXT_CONTENT = 'Ä'
  const placeholder = new ElemRect(placeholderRef)
  const container = new ElemRect(containerRef)

  const createVector = (p5: p5) =>
    text = new Text(p5, configs.VECTOR_STRING_TRANSLATE)

  const setup = createVector

  const draw = () => {
    const [x, y] = placeholder.center
    const size = placeholder.w * 0.35
    text.setTransform({ x, y, scale: new Size(size / 45) })
    text.setting.maxStretch = size / 6.25
    text.setMouseOrigin(container.center)
    text.write(TEXT_CONTENT)
  }

  const windowResized = createVector

  return { setup, draw, windowResized }
}

export default drawVectorString
