import Text from '../helpers/vector/text'
import ElemRect from '../../utils/helpers/elemRect'
import configs from '../configs/vector'

const drawVectorString = ({ containerRef, placeholderRef }) => {
  let text
  const TEXT_CONTENT = 'Ä'
  const placeholder = new ElemRect(placeholderRef)
  const container = new ElemRect(containerRef)

  const createVector = p5 =>
    text = new Text(p5, configs.VECTOR_STRING_TRANSLATE)

  const setup = createVector

  const draw = () => {
    const [x, y] = placeholder.center
    const size = placeholder.w * 0.35
    text.setTransform({ x, y, scale: size / 45 })
    text.setting.maxStretch = size / 6.25
    text.setMouseOrigin(container.center)
    text.write(TEXT_CONTENT)
  }

  const windowResized = createVector

  return { setup, draw, windowResized }
}

export default drawVectorString
