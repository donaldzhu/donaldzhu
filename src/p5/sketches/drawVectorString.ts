import p5 from 'p5'
import Size from '../../utils/helpers/size'
import configs from '../configs/vector'
import Text from '../helpers/vector/text'
import { domSizes } from '../../styles/sizes'

const drawVectorString = () => {
  let text: Text

  const createVector = (p5: p5) =>
    text = new Text(p5, 'Ä', configs.VECTOR_STRING_TRANSLATE)

  const setup = (p5: p5) => {
    createVector(p5)
  }

  const draw = (p5: p5) => {
    const x = p5.width / 2
    const y = p5.height / 2
    const size = p5.width * 0.35
    text.setTransform({ x, y, scale: new Size(size / 45) })
    text.setting.maxStretch = size / 6.25

    const rowCenter = domSizes.desktop.mainContainer.left.add(
      domSizes.desktop.mainContainer.width.div(2)
    ).value

    text.setMouseOrigin([
      rowCenter - p5.canvas.getBoundingClientRect().x, +
      y
    ])

    text.write()
  }

  const windowResized = createVector

  return { setup, draw, windowResized }
}

export default drawVectorString
