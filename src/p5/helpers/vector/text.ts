import _ from 'lodash'
import p5 from 'p5'
import { CoorObject, coorTuple } from '../../../utils/utilTypes'
import Size from '../../../utils/helpers/size'
import vectorsData from '../../../data/vector/glyphs.json'
import { MobileCanvasStates } from '../../../components/canvas/canvasTypes'
import { DEFAULT_SETTING, SPACE_DELIMITER, X_HEIGHT, YPosition } from './constants'
import Glyph from './glyph'
import { SetTransformProps, SetTransformScaleProps, VectorSetting } from './vectorTypes'


interface BoundsInterface {
  x1: number
  y1: number
  x2: number
  y2: number
  cx: number
  cy: number
  w: number
  h: number
  wordWidths: number[]
}

type wordGlyph = Glyph | typeof SPACE_DELIMITER

class Text {
  private didRepositionActive: boolean
  glyphWords: wordGlyph[][]
  setting: VectorSetting
  bounds: BoundsInterface

  constructor(
    p5: p5 | p5.Graphics,
    text: string,
    setting: Partial<VectorSetting> & { w?: Size },
    canvasStates?: MobileCanvasStates,
  ) {
    if (setting.w) setting.scale = new Size(1)


    this.setting = _.defaults(setting, DEFAULT_SETTING, {
      mouseOrigin: p5.createVector(setting.x, setting.y)
    })

    const wordArrays = text.toLocaleUpperCase().split('\n')
    this.glyphWords = wordArrays.map(word => {
      const glyphWord = Array.from(word) as (keyof typeof vectorsData | typeof SPACE_DELIMITER)[]
      return glyphWord.map(name => name !== SPACE_DELIMITER ?
        new Glyph(p5, name, this.setting, canvasStates) :
        SPACE_DELIMITER
      )
    })

    this.bounds = this.getBounds()
    this.didRepositionActive = false

    if (setting.w) {
      const bounds = this.getBounds()
      this.setTransform({ scale: setting.w.div(bounds.w) })
    }

    this.addBodies()
  }

  write() {
    const { scale, position, align, leading } = this.setting

    let { y1 } = this.bounds
    const { x1, wordWidths, w } = this.bounds

    this.glyphWords.forEach((glyphWord, i) => {
      const wordX = x1 + align / 2 * (w - wordWidths[i])
      this.writeWord(glyphWord, wordX, y1)
      const scaledLeading = leading.value * scale.value
      if (position[1] === YPosition.Bottom) y1 -= scaledLeading
      else y1 += scaledLeading
    })

    this.didRepositionActive = true
  }

  addBodies() {
    this.loopGlyphs(glyph => glyph.addBodies())
  }

  cleanup() {
    this.loopGlyphs(glyph => glyph.cleanup())
  }

  setTransform(newTransform: SetTransformProps, shouldRepositionActive = true) {
    const { x, y, scale } =
      Object.assign(this.setting, _.defaults({ ...newTransform }, this.setting))
    this.bounds = this.getBounds()

    this.loopGlyphs(glyph => {
      Object.assign(glyph.setting, this.setting)
      this.transformGlyph({ x, y, scale }, glyph, shouldRepositionActive)
    })
  }

  setMouseOrigin(newOrigin: coorTuple | CoorObject) {
    if (!Array.isArray(newOrigin))
      newOrigin = [newOrigin.x, newOrigin.y]
    this.setting.mouseOrigin.set(...newOrigin)
  }

  loopGlyphs(callback: (
    glyph: Glyph,
    glyphIndex: number,
    glyphWord: wordGlyph[],
    glyphWordIndex: number
  ) => void) {
    this.glyphWords.forEach((glyphWord, glyphWordIndex) =>
      glyphWord.forEach((glyph, glyphIndex) => {
        if (glyph !== SPACE_DELIMITER)
          callback(glyph, glyphIndex, glyphWord, glyphWordIndex)
      })
    )
  }

  private writeWord(glyphWord: wordGlyph[], x: number, y: number) {
    const shouldRepositionActive = !this.didRepositionActive
    glyphWord.forEach((glyph, i) =>
      x += this.getCurrentGlyphPosition(glyph, i, glyphWord, () => {
        if (glyph === SPACE_DELIMITER) return
        this.transformGlyph({ x, y }, glyph, shouldRepositionActive)
        glyph.draw()
      }))
  }

  private getBounds() {
    const { setting, textHeight, wordWidths } = this
    const { position, x, y } = setting
    const [xPosition, yPosition] = position

    const textWidth = Math.max(...wordWidths)

    const x1 = x - xPosition / 2 * textWidth
    const y1 = y - yPosition / 2 * textHeight

    const bounds = {
      x1, y1,
      x2: x1 + textWidth,
      y2: y1 + textHeight,
      cx: x1 + textWidth / 2,
      cy: y1 + textHeight / 2,
      w: textWidth,
      h: textHeight,
      wordWidths
    }

    return bounds
  }

  private transformGlyph(
    newTransform: SetTransformScaleProps,
    glyph: Glyph,
    shouldRepositionActive?: boolean
  ) {
    glyph.still.setTransform(newTransform)
    glyph.active.setTransform(newTransform)
    glyph.repositionBodies(shouldRepositionActive)
  }

  private getCurrentGlyphPosition(
    glyph: wordGlyph,
    i: number,
    glyphWord: wordGlyph[],
    callback?: () => void
  ) {
    const { scale, spaceWidth } = this.setting
    const nextGlyph = glyphWord[i + 1]
    const lsb = nextGlyph && nextGlyph !== SPACE_DELIMITER ?
      nextGlyph.getBearings()[0] : 0

    if (glyph === SPACE_DELIMITER)
      return spaceWidth.value * scale.value + lsb

    if (callback) callback()
    const rsb = nextGlyph ? glyph.getBearings()[1] : 0
    return glyph.w + rsb + lsb
  }

  get textHeight() {
    const { scale, leading } = this.setting
    return ((this.glyphWords.length - 1) * leading.value + X_HEIGHT) * scale.value
  }

  get wordWidths() {
    return this.glyphWords.map(glyphWord =>
      glyphWord.reduce((sum, glyph, i) =>
        sum + this.getCurrentGlyphPosition(glyph, i, glyphWord), 0))
  }
}

export default Text
