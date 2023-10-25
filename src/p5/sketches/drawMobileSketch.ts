import p5 from 'p5'
import { sketchSizes } from '../../styles/sizes'
import { validateRef } from '../../utils/typeUtils'
import { coorTuple } from '../../utils/utilTypes'
import configs from '../configs/vector'
import Text from '../helpers/vector/text'
import { getVw } from '../../utils/sizeUtils'
import { CanvasState } from '../../components/canvas/canvasTypes'
import { loopObject } from '../../utils/commonUtils'


const drawMobileSketch = () => {
  let texts: Record<string, Text>

  const createVectors = (p5: p5, canvasState: CanvasState) => {
    const x = getVw(50)

    const workIn = new Text(p5, 'WORK IN', {
      ...configs.MOBILE_UPPER, x,
      y: sketchSizes.mobile.top.value,
      spaceWidth: sketchSizes.mobile.spaceWidth,
      tracking: sketchSizes.mobile.tracking.workIn
    }, canvasState)

    const process = new Text(p5, 'PROCESS', {
      ...configs.MOBILE_UPPER, x,
      y: workIn.bounds.y2 + sketchSizes.mobile.leading.value,
      tracking: sketchSizes.mobile.tracking.process
    }, canvasState)

    const donald = new Text(p5, 'DONALD', {
      ...configs.MOBILE_LOWER, x,
      y: process.bounds.y2 + sketchSizes.mobile.centerPadding.value,
    }, canvasState)

    const zhu = new Text(p5, 'ZHU', {
      ...configs.MOBILE_LOWER, x,
      y: donald.bounds.y2 + sketchSizes.mobile.leading.value,
    }, canvasState)

    const mouseOrigin: coorTuple =
      [x, (donald.bounds.y1 - process.bounds.y2) / 2]
    texts = { workIn, process, donald, zhu }
    loopObject(texts, (_, text) => text.setMouseOrigin(mouseOrigin))
  }

  const setup = (p5: p5, canvasState: CanvasState) => {
    createVectors(p5, canvasState)
  }

  const draw = (p5: p5, { gimbalRef }: CanvasState) => {
    if (!texts) return
    loopObject(texts, (_, text) => text.write())
    if (!validateRef(gimbalRef)) return
    gimbalRef.current.update()
  }

  const windowResized = createVectors

  return { setup, draw, windowResized }
}


export default drawMobileSketch

