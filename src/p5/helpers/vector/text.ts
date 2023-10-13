import _ from 'lodash'
import Glyph from './glyph'
import { loopObject, keysToObject } from '../../../utils/commonUtils'
import { DEFAULT_SETTING, GLYPH_NAMES, X_HEIGHT } from './constants'
import p5 from 'p5'
import { SetTransformProps, VectorSetting } from './vectorTypes'
import { coorObject, coorTuple } from '../../../utils/utilTypes'

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

class Text {
  setting: VectorSetting
  glyphs: Record<string, Glyph>
  cachedBounds: Map<string, BoundsInterface>

  constructor(p5: p5 | p5.Graphics, setting: VectorSetting) {
    this.setting = {
      ...DEFAULT_SETTING,
      ...setting,
      mouseOrigin: p5.createVector(setting.x, setting.y)
    }

    this.setting.scale = setting.scale
    this.glyphs = keysToObject(GLYPH_NAMES,
      name => new Glyph(p5, name, this.setting))

    this.cachedBounds = new Map<string, BoundsInterface>()
  }

  write(text: string) {
    text = text.toLocaleUpperCase()
    const { scale, position, align, leading } = this.setting
    const wordArray = text.split('\n')

    const bounds = this.cachedBounds.get(text) ||
      this.getBounds(text)
    let { y1 } = bounds
    const { x1, wordWidths, w } = bounds

    wordArray.forEach((word, i) => {
      const wordX = x1 + align / 2 * (w - wordWidths[i])
      this.writeWord(word, wordX, y1)
      const scaledLeading = leading * scale.value
      // TODO
      // if (position === YPositions.Bottom) y1 -= scaledLeading
      // else 
      y1 += scaledLeading
    })
  }

  writeWord(word: string, x: number, y: number) {
    const { scale, spaceWidth, spaceDelimiter } = this.setting
    const charArray = Array.from(word)
    charArray.forEach((char, i) => {
      if (char === spaceDelimiter)
        return x += spaceWidth * scale.value

      const glyph = this.glyphs[char]
      glyph.still.setTransform({ x, y })
      glyph.draw()

      const nextGlyph = this.glyphs[charArray[i + 1]]
      const rsb = glyph.getBearings()[1]
      const lsb = nextGlyph?.getBearings()[0] || 0
      x += glyph.w + rsb + lsb
    })
  }

  getBounds(text: string) {
    text = text.toLocaleUpperCase()
    const { position, x, y } = this.setting
    const [xPosition, yPosition] = position
    const wordArray = text.split('\n')

    const textHeight = this.getTextHeight(wordArray.length)
    const wordWidths = this.getWordWidths(wordArray)
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

    this.cachedBounds.set(text, bounds)

    return bounds
  }

  setTransform(newTransform: SetTransformProps) {
    const { x, y, scale } =
      Object.assign(this.setting, _.defaults(newTransform, this.setting))
    this.cachedBounds.clear()

    loopObject(this.glyphs, (_, glyph) => {
      Object.assign(glyph.setting, this.setting)
      glyph.still.setTransform({ x, y, scale })
      glyph.active.setTransform({ x, y, scale })
    })
  }

  setMouseOrigin(newOrigin: coorTuple | coorObject) {
    if (!Array.isArray(newOrigin))
      newOrigin = [newOrigin.x, newOrigin.y]
    this.setting.mouseOrigin.set(...newOrigin)
  }

  private getTextHeight(wordCount: number) {
    const { scale, leading } = this.setting
    return ((wordCount - 1) * leading + X_HEIGHT) * scale.value
  }

  private getWordWidths(wordArray: string[]) {
    const { scale, spaceWidth, spaceDelimiter } = this.setting
    return wordArray.map(charArray =>
      Array.from(charArray).reduce((sum, char, i) => {
        if (char === spaceDelimiter) return sum + spaceWidth * scale.value
        const glyph = this.glyphs[char]
        const [lsb, rsb] = glyph.getBearings()
        return sum + glyph.w +
          (i ? lsb : 0) +
          (i < charArray.length - 1 ? rsb : 0)
      }, 0))
  }
}

export default Text
