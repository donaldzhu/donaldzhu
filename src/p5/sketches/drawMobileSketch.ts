import p5 from 'p5'
import { sketchSizes } from '../../styles/sizes'
import ElemRect from '../../utils/helpers/rect/elemRect'
import { validateRef } from '../../utils/typeUtils'
import { coorTuple } from '../../utils/utilTypes'
import configs from '../configs/vector'
import Text from '../helpers/vector/text'
import { PlaceholderProp } from './sketchTypes'

const drawMainSketch = ({ placeholderRef }: PlaceholderProp) => {
  const UPPER_TEXT_CONTENT = 'WORK IN\nPROGRESS'
  const LOWER_TEXT_CONTENT = 'DONALD\nZHU'

  let placeholder: ElemRect<HTMLDivElement>
  let upperText: Text, lowerText: Text
  let mouseOrigin: coorTuple | [] = []

  const createVectors = (p5: p5) => {
    const [x, y] = placeholder.center
    const centerPadding = sketchSizes.main.centerPadding.value

    upperText = new Text(p5, {
      ...configs.MAIN_UPPER, x, y
    })

    const { h: upperH } = upperText.getBounds(UPPER_TEXT_CONTENT)
    upperText.setTransform({ y: y - (upperH + centerPadding) / 2 })

    lowerText = new Text(p5, {
      ...configs.MAIN_LOWER, x, y
    })

    const { h: lowerH } = lowerText.getBounds(LOWER_TEXT_CONTENT)
    lowerText.setTransform({ y: y + (lowerH + centerPadding) / 2 })

    mouseOrigin = placeholder.center
    upperText.setMouseOrigin(mouseOrigin)
    lowerText.setMouseOrigin(mouseOrigin)
  }

  const setup = (p5: p5) => {
    if (!validateRef(placeholderRef))
      throw new Error('Main sketch has no placeholder ref.')
    placeholder = new ElemRect(placeholderRef, -sketchSizes.main.anchor.offset.value)
    createVectors(p5)
  }

  const draw = () => {
    upperText.write(UPPER_TEXT_CONTENT)
    lowerText.write(LOWER_TEXT_CONTENT)
  }

  const windowResized = createVectors

  return { setup, draw, windowResized }
}


export default drawMainSketch
