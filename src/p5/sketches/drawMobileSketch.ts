import p5 from 'p5'
import _ from 'lodash'
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

  const createVectors = (p5: p5) => {
    const x = getVw(50)

    const workIn = new Text(p5, 'WORK IN', {
      ...configs.MOBILE_UPPER, x,
      y: sketchSizes.mobile.top.value,
      spaceWidth: sketchSizes.mobile.spaceWidth,
      tracking: sketchSizes.mobile.tracking.workIn
    })

    const process = new Text(p5, 'PROCESS', {
      ...configs.MOBILE_UPPER, x,
      y: workIn.bounds.y2 + sketchSizes.mobile.leading.value,
      tracking: sketchSizes.mobile.tracking.process
    })

    const donald = new Text(p5, 'DONALD', {
      ...configs.MOBILE_LOWER, x,
      y: process.bounds.y2 + sketchSizes.mobile.centerPadding.value,
    })

    const zhu = new Text(p5, 'ZHU', {
      ...configs.MOBILE_LOWER, x,
      y: donald.bounds.y2 + sketchSizes.mobile.leading.value,
    })

    const mouseOrigin: coorTuple =
      [x, (donald.bounds.y1 - process.bounds.y2) / 2]
    texts = { workIn, process, donald, zhu }
    loopObject(texts, (_, text) => text.setMouseOrigin(mouseOrigin))
  }

  const setup = (p5: p5) => {
    createVectors(p5)
  }

  const draw = (p5: p5, { motionSettingsRef, motionRef }: CanvasState) => {
    if (!texts) return
    loopObject(texts, (_, text) => text.write())

    if (!validateRef(motionSettingsRef) || !validateRef(motionRef)) return
    p5.text(`${motionSettingsRef.current.isUsable}`, 10, 10)
    p5.text(`${motionSettingsRef.current.needsPermission}`, 10, 20)
    p5.text(`x: ${motionRef.current.x}`, 10, 30)
    p5.text(`y: ${motionRef.current.y}`, 10, 40)
    p5.text(`z: ${motionRef.current.z}`, 10, 50)
  }

  const windowResized = createVectors

  return { setup, draw, windowResized }
}


export default drawMobileSketch

