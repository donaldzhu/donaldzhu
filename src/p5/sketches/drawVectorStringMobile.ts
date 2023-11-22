import configs from '../configs/vector'
import Text from '../helpers/vector/text'
import Size from '../../utils/helpers/size'
import type { MutableRefObject } from 'react'
import type p5 from 'p5'


interface DrawVectorStringMobileProps {
  imgSrcRef: MutableRefObject<number | undefined>
}

const drawVectorStringMobile = ({ imgSrcRef }: DrawVectorStringMobileProps) => {
  let text: Text

  const createVector = (p5: p5) => {
    text = new Text(p5, 'Ä', configs.VECTOR_STRING_TRANSLATE_MOBILE)
    text.setting.mapFunction = (stillVector) => {
      const segmentation = 20 // TODO
      const segmentSize = Math.PI * 2 / segmentation
      const imgSrc = imgSrcRef.current ?? 1
      const activeVector = p5.createVector(1, 1)
        .setHeading(segmentSize * (imgSrc - 1))
        .setMag((new Size({ vw: 4 })).value)
        .add(stillVector)
      return activeVector
    }
  }


  const setup = (p5: p5) => {
    createVector(p5)
  }

  const draw = (p5: p5) => {
    const x = p5.width / 2
    const y = p5.height / 2
    text.setTransform({ x, y })
    text.setMouseOrigin([x, y])
    text.write()
  }

  const windowResized = createVector

  return { setup, draw, windowResized }
}

export default drawVectorStringMobile
