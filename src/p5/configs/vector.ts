import colors from '../../styles/colors'
import { sketchSizes } from '../../styles/sizes'
import Size from '../../utils/helpers/size'
import { Easing, VectorDrawMethod, XPosition, YPosition } from '../helpers/vector/constants'
import type { VectorPosition, VectorSetting } from '../helpers/vector/vectorTypes'

export const vectorStringCount = 20

const mainSketchConfigs: Partial<VectorSetting> = {
  scale: sketchSizes.desktop.main.scale,
  tracking: sketchSizes.desktop.main.tracking,
  leading: sketchSizes.desktop.main.leading,
  easing: Easing.EaseOutQuad,
  maxStretch: 18.5,
  glyphColor: colors.homeSketch,
  linkColor: colors.homeSketch,
}

const mobileSketchConfigs: Partial<VectorSetting> = {
  isMobile: true,
  scale: sketchSizes.mobile.main.scale,
  maxStretch: { x: 20, y: 14.5 },
  position: [XPosition.Center, YPosition.Top] satisfies VectorPosition,
  easing: Easing.EaseOutCubic,
  glyphColor: colors.homeSketch,
  linkColor: colors.homeSketch,
  spaceWidth: new Size(15)
}

const vectorStringTranslateConfigs: Partial<VectorSetting> = {
  pointColor: colors.vectorStringSketch,
  pointFill: colors.vectorStringSketch,
  glyphColor: colors.vectorStringSketch,
  linkColor: colors.vectorStringSketch,
}

const configs: Record<string, Partial<VectorSetting>> = {
  MAIN_UPPER: {
    ...mainSketchConfigs,
    glyphWeight: sketchSizes.desktop.main.weight.glyph,
    linkWeight: sketchSizes.desktop.main.weight.link,
    pointSize: sketchSizes.desktop.main.pointSize,
    pointColor: colors.homeSketch,
    pointFill: colors.homeSketch,
    drawingSequence: [VectorDrawMethod.DrawLinks, VectorDrawMethod.DrawPoints],
  },
  MAIN_LOWER: {
    ...mainSketchConfigs,
    glyphWeight: sketchSizes.desktop.main.weight.lower,
    linkWeight: sketchSizes.desktop.main.weight.lower,
    volumeColor: colors.homeSketch,
    drawingSequence: [VectorDrawMethod.DrawLinks, VectorDrawMethod.DrawVolume],
  },
  MOBILE_UPPER: {
    ...mobileSketchConfigs,
    glyphWeight: sketchSizes.mobile.main.weight.glyph,
    linkWeight: sketchSizes.mobile.main.weight.link,
    pointSize: sketchSizes.mobile.main.pointSize,
    pointColor: colors.homeSketch,
    pointFill: colors.homeSketch,
    drawingSequence: [VectorDrawMethod.DrawLinks, VectorDrawMethod.DrawPoints],
  },
  MOBILE_LOWER: {
    ...mobileSketchConfigs,
    leading: sketchSizes.mobile.main.leading,
    tracking: sketchSizes.mobile.main.tracking.lower,
    glyphWeight: sketchSizes.mobile.main.weight.lower,
    linkWeight: sketchSizes.mobile.main.weight.lower,
    volumeColor: colors.homeSketch,
    drawingSequence: [VectorDrawMethod.DrawLinks, VectorDrawMethod.DrawVolume],
  },
  HOME_ICON: {
    scale: sketchSizes.desktop.homeIcon.scale,
    position: [XPosition.Left, YPosition.Top],
    glyphWeight: sketchSizes.desktop.homeIcon.weight,
    linkWeight: sketchSizes.desktop.homeIcon.weight,
    glyphColor: colors.homeIcon,
    linkColor: colors.homeIcon,
    volumeColor: colors.homeIcon,
    easing: Easing.EaseOutCubic,
    drawingSequence: [VectorDrawMethod.DrawLinks, VectorDrawMethod.DrawVolume],
    maxStretch: 8,
  },
  VECTOR_STRING_TRANSLATE: {
    ...vectorStringTranslateConfigs,
    glyphWeight: sketchSizes.desktop.string.weight.glyph,
    linkWeight: sketchSizes.desktop.string.weight.link,
    pointSize: sketchSizes.desktop.string.pointSize,
    drawingSequence: [VectorDrawMethod.DrawLinks, VectorDrawMethod.DrawPoints]
  },
  VECTOR_STRING_TRANSLATE_MOBILE: {
    ...vectorStringTranslateConfigs,
    w: new Size({ vw: 20 }),
    glyphWeight: sketchSizes.mobile.string.weight.glyph,
    linkWeight: sketchSizes.mobile.string.weight.link,
    pointSize: sketchSizes.mobile.string.pointSize,
    drawingSequence: [VectorDrawMethod.DrawLinks, VectorDrawMethod.DrawPoints],
  }
}

export default configs