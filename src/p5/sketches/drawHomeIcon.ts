import p5 from 'p5'
import { MutableRefObject } from 'react'
import colors from '../../styles/colors'
import { domSizes } from '../../styles/sizes'
import ElemRect from '../../utils/helpers/rect/elemRect'
import { validateRef } from '../../utils/typeUtils'
import configs from '../configs/vector'
import Text from '../helpers/vector/text'

interface DrawHomeIconProps {
  placeholderRef: MutableRefObject<HTMLDivElement | null>
  isHoveringRef: MutableRefObject<boolean>
}

const drawHomeIcon = ({ placeholderRef, isHoveringRef }: DrawHomeIconProps) => {
  let text: Text
  const TEXT_CONTENT = 'A'
  const sidebarPaddingLeft = domSizes.homeIcon.padding.left.value / 2
  let placeholder: ElemRect<HTMLDivElement>

  const createVector = (p5: p5) => {
    text = new Text(p5, configs.HOME_ICON)
    const { center, x, y } = placeholder
    text.setMouseOrigin(center)
    text.setTransform({ x, y })
  }

  const setup = (p5: p5) => {
    if (!validateRef(placeholderRef))
      throw new Error('Home icon has no placeholder ref.')
    placeholder = new ElemRect(placeholderRef, -sidebarPaddingLeft)
    createVector(p5)
  }

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
