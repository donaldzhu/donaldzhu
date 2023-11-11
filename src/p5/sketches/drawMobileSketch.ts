import p5 from 'p5'
import { domSizes, sketchSizes } from '../../styles/sizes'
import { validateRef } from '../../utils/typeUtils'
import { coorTuple } from '../../utils/utilTypes'
import configs from '../configs/vector'
import Text from '../helpers/vector/text'
import { getVw } from '../../utils/sizeUtils'
import { MobileCanvasStates } from '../../components/canvas/canvasTypes'
import { loopObject } from '../../utils/commonUtils'

const drawMobileSketch = () => {
  let texts: Record<string, Text>

  const createVectors = (p5: p5, canvasStates: MobileCanvasStates) => {
    const x = getVw(50)

    const workIn = new Text(p5, 'WORK IN', {
      ...configs.MOBILE_UPPER, x,
      y: sketchSizes.mobile.main.top.add(domSizes.mobile.header.height).value,
      spaceWidth: sketchSizes.mobile.main.spaceWidth,
      tracking: sketchSizes.mobile.main.tracking.workIn
    }, canvasStates)

    const process = new Text(p5, 'PROCESS', {
      ...configs.MOBILE_UPPER, x,
      y: workIn.bounds.y2 + sketchSizes.mobile.main.leading.value,
      tracking: sketchSizes.mobile.main.tracking.process
    }, canvasStates)

    const donald = new Text(p5, 'DONALD', {
      ...configs.MOBILE_LOWER, x,
      y: process.bounds.y2 + sketchSizes.mobile.main.centerPadding.value,
    }, canvasStates)

    const zhu = new Text(p5, 'ZHU', {
      ...configs.MOBILE_LOWER, x,
      y: donald.bounds.y2 + sketchSizes.mobile.main.leading.value,
    }, canvasStates)

    const mouseOrigin: coorTuple =
      [x, (donald.bounds.y1 - process.bounds.y2) / 2]
    texts = { workIn, process, donald, zhu }
    loopObject(texts, (_, text) => {
      text.setMouseOrigin(mouseOrigin)
      text.addBodies()
    })
  }

  const setup = (p5: p5, canvasState: MobileCanvasStates) => {
    createVectors(p5, canvasState)
  }

  const draw = (_: p5, { gimbalRef }: MobileCanvasStates) => {
    if (!texts) return
    loopObject(texts, (_, text) => text.write())
    if (!validateRef(gimbalRef)) return
    gimbalRef.current.update()
  }

  const windowResized = createVectors

  const cleanup = () => {
    if (!texts) return
    Object.values(texts).forEach(text => text.cleanup())
  }

  return { setup, draw, windowResized, cleanup }
}


export default drawMobileSketch

