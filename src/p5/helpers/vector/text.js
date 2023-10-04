import _ from 'lodash'
import Glyph from './glyph'
import { mapObject, keysToObject, callFunctionLike } from '../../../utils/commonUtils'
import { DEFAULT_SETTING, GLYPH_NAMES, X_HEIGHT, X_POSITIONS, Y_POSITIONS } from './constants'

class Text {
  constructor(p5, setting) {
    this.setting = {
      ...DEFAULT_SETTING,
      ...setting,
      mouseOrigin: p5.createVector(setting.x, setting.y)
    }

    this.setting.scale = callFunctionLike(setting.scale)
    this.glyphs = keysToObject(GLYPH_NAMES,
      name => new Glyph(p5, name, this.setting))

    this.cachedBounds = new Map()
  }

  write(text) {
    text = text.toLocaleUpperCase()
    const { scale, position, align, leading } = this.setting
    const wordArray = text.split('\n')

    let { x1, y1, wordWidths, w } = this.cachedBounds.get(text) ||
      this.getBounds(text)

    wordArray.forEach((word, i) => {
      const wordX = x1 + X_POSITIONS[align] / 2 * (w - wordWidths[i])
      this.writeWord(word, wordX, y1)
      const scaledLeading = leading * scale
      if (position === Y_POSITIONS.BOTTOM) y1 -= scaledLeading
      else y1 += scaledLeading
    })
  }

  writeWord(word, x, y) {
    const { scale, spaceWidth, spaceDelimiter } = this.setting
    const charArray = Array.from(word)
    charArray.forEach((char, i) => {
      if (char === spaceDelimiter)
        return x += spaceWidth * scale

      const glyph = this.glyphs[char]
      glyph.still.setTransform({ x, y })
      glyph.draw()

      const nextGlyph = this.glyphs[charArray[i + 1]]
      const rsb = glyph.getBearings()[1]
      const lsb = nextGlyph?.getBearings()[0] || 0
      x += glyph.w + rsb + lsb
    })
  }

  getBounds(text) {
    text = text.toLocaleUpperCase()
    const { position, x, y } = this.setting
    const [xPosition, yPosition] = position
    const wordArray = text.split('\n')

    const textHeight = this._getTextHeight(wordArray.length)
    const wordWidths = this._getWordWidths(wordArray)
    const textWidth = Math.max(...wordWidths)

    const x1 = x - X_POSITIONS[xPosition] / 2 * textWidth
    const y1 = y - Y_POSITIONS[yPosition] / 2 * textHeight

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

  setTransform(newTransform) {
    const { x, y, scale } =
      Object.assign(this.setting, _.defaults(newTransform, this.setting))
    this.cachedBounds.clear()

    mapObject(this.glyphs, (_, glyph) => {
      Object.assign(glyph.setting, this.setting)
      glyph.still.setTransform({ x, y, scale })
      glyph.active.setTransform({ x, y, scale })
    })
  }

  setMouseOrigin(newOrigin) {
    if (!Array.isArray(newOrigin) && typeof newOrigin === 'object')
      newOrigin = [newOrigin.x, newOrigin.y]
    this.setting.mouseOrigin.set(...newOrigin)
  }

  _getTextHeight(wordCount) {
    const { scale, leading } = this.setting
    return ((wordCount - 1) * leading + X_HEIGHT) * scale
  }

  _getWordWidths(wordArray) {
    const { scale, spaceWidth, spaceDelimiter } = this.setting
    return wordArray.map(charArray =>
      Array.from(charArray).reduce((sum, char, i) => {
        if (char === spaceDelimiter) return sum + spaceWidth * scale
        const glyph = this.glyphs[char]
        const [lsb, rsb] = glyph.getBearings()
        return sum + glyph.w +
          (i ? lsb : 0) +
          (i < charArray.length - 1 ? rsb : 0)
      }, 0))
  }
}

export default Text
