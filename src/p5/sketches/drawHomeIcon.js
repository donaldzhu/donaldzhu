import Text from '../helpers/vector/text'
import ElemRect from '../../utils/helpers/rect/elemRect'
import colors from '../../styles/colors'
import { domSizes } from '../../styles/sizes'
import configs from '../configs/vector'

const drawHomeIcon = ({ placeholderRef, isHoveringRef }) => {
  let text
  const TEXT_CONTENT = 'A'
  const sidebarPaddingLeft = domSizes.homeIcon.padding.left.value / 2
  const placeholder = new ElemRect(placeholderRef, -sidebarPaddingLeft)

  const createVector = p5 => {
    text = new Text(p5, configs.HOME_ICON)
    const { center, x, y } = placeholder
    text.setMouseOrigin(center)
    text.setTransform({ x, y })
  }

  const setup = createVector

  const draw = () => {
    const { setting } = text
    const color = isHoveringRef.current ? colors.homeSketch : colors.homeIcon
    setting.glyphColor = setting.linkColor = setting.volumeColor = color
    text.write(TEXT_CONTENT)
  }

  const windowResized = createVector

  return { setup, draw, windowResized }
}

export default drawHomeIcon
