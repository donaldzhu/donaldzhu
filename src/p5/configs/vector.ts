import colors from '../../styles/colors'
import { sketchSizes } from '../../styles/sizes'
import Size from '../../utils/helpers/size'
import { XPosition, YPosition } from '../helpers/vector/constants'
import { Easing, VectorDrawMethod, VectorPosition, VectorSetting } from '../helpers/vector/vectorTypes'

const mainSketchConfigs: Partial<VectorSetting> = {
  scale: sketchSizes.main.scale,
  tracking: sketchSizes.main.tracking,
  leading: sketchSizes.main.leading,
  easing: Easing.EaseOutQuad,
  maxStretch: 18.5,
  glyphColor: colors.homeSketch,
  linkColor: colors.homeSketch,
}

const mobileSketchConfigs: Partial<VectorSetting> = {
  isMobile: true,
  scale: sketchSizes.mobile.scale,
  maxStretch: { x: 20, y: 14.5 },
  position: [XPosition.Center, YPosition.Top] satisfies VectorPosition,
  easing: Easing.EaseOutQuad,
  glyphColor: colors.homeSketch,
  linkColor: colors.homeSketch,
  spaceWidth: new Size(15)
}


const configs: Record<string, Partial<VectorSetting>> = {
  MAIN_UPPER: {
    ...mainSketchConfigs,
    glyphWeight: sketchSizes.main.weight.glyph,
    linkWeight: sketchSizes.main.weight.link,
    pointSize: sketchSizes.main.pointSize,
    pointColor: colors.homeSketch,
    pointFill: colors.homeSketch,
    drawingSequence: [VectorDrawMethod.DrawLinks, VectorDrawMethod.DrawPoints],
  },
  MAIN_LOWER: {
    ...mainSketchConfigs,
    glyphWeight: sketchSizes.main.weight.lower,
    linkWeight: sketchSizes.main.weight.lower,
    volumeColor: colors.homeSketch,
    drawingSequence: [VectorDrawMethod.DrawLinks, VectorDrawMethod.DrawVolume],
  },
  MOBILE_UPPER: {
    ...mobileSketchConfigs,
    glyphWeight: sketchSizes.mobile.weight.glyph,
    linkWeight: sketchSizes.mobile.weight.link,
    pointSize: sketchSizes.mobile.pointSize,
    pointColor: colors.homeSketch,
    pointFill: colors.homeSketch,
    drawingSequence: [VectorDrawMethod.DrawLinks, VectorDrawMethod.DrawPoints],
  },
  MOBILE_LOWER: {
    ...mobileSketchConfigs,
    leading: sketchSizes.mobile.leading,
    tracking: sketchSizes.mobile.tracking.lower,
    glyphWeight: sketchSizes.mobile.weight.lower,
    linkWeight: sketchSizes.mobile.weight.lower,
    volumeColor: colors.homeSketch,
    drawingSequence: [VectorDrawMethod.DrawLinks, VectorDrawMethod.DrawVolume],
  },
  HOME_ICON: {
    scale: sketchSizes.homeIcon.scale,
    position: [XPosition.Left, YPosition.Top],
    glyphWeight: sketchSizes.homeIcon.weight,
    linkWeight: sketchSizes.homeIcon.weight,
    glyphColor: colors.homeIcon,
    linkColor: colors.homeIcon,
    volumeColor: colors.homeIcon,
    easing: Easing.EaseOutCubic,
    drawingSequence: [VectorDrawMethod.DrawLinks, VectorDrawMethod.DrawVolume],
    maxStretch: 8,
  },
  VECTOR_STRING_TRANSLATE: {
    glyphWeight: sketchSizes.string.weight.glyph,
    linkWeight: sketchSizes.string.weight.link,
    pointSize: sketchSizes.string.pointSize,
    pointColor: colors.vectorStringSketch,
    pointFill: colors.vectorStringSketch,
    glyphColor: colors.vectorStringSketch,
    linkColor: colors.vectorStringSketch,
    drawingSequence: [VectorDrawMethod.DrawLinks, VectorDrawMethod.DrawPoints],
    mapFunction: function (stillVector, mouseVector) {
      const distVector = mouseVector.sub(this.mouseOrigin ?? stillVector)
      const segmentation = 20
      const segmentSize = Math.PI * 2 / segmentation
      const segmentedHeading = Math.floor(distVector.heading() / segmentSize) * segmentSize
      const maxStretch = typeof this.maxStretch === 'object' ?
        this.maxStretch.x :
        this.maxStretch
      distVector
        .setHeading(segmentedHeading)
        .setMag(maxStretch ?? 1)
        .add(stillVector)
      return distVector
    }
  }
}

export default configs