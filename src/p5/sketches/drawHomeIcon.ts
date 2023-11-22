import colors from '../../styles/colors'
import { domSizes } from '../../styles/sizes'
import ElemRect from '../../utils/helpers/rect/elemRect'
import { validateRef } from '../../utils/typeUtils'
import configs from '../configs/vector'
import Text from '../helpers/vector/text'
import type p5 from 'p5'
import type { MutableRefObject } from 'react'
import type { PlaceholderProp } from './sketchTypes'

type DrawHomeIconProps = {
  isHoveringRef: MutableRefObject<boolean>
} & PlaceholderProp

const drawHomeIcon = ({ placeholderRef, isHoveringRef }: DrawHomeIconProps) => {
  let text: Text
  const sidebarPaddingLeft = domSizes.desktop.homeIcon.padding.left.value / 2
  let placeholder: ElemRect<HTMLDivElement>

  const createVector = (p5: p5) => {
    text = new Text(p5, 'A', configs.HOME_ICON)
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
    text.write()
  }

  const windowResized = createVector

  return { setup, draw, windowResized }
}

export default drawHomeIcon
