import { loopObject } from '../utils/commonUtils.ts'

const COLOR_PRESET = 0

const red = '#ED1C24'
const blue = '#155FB3'
const black = 'black'
const white = 'white'

const swatches = [
  [red, blue, white, black]
]
const colors: Record<string, string | number> = {
  background: 2,
  defaultText: 1,
  defaultTextSelectColor: 2,
  defaultTextSelectBg: 1,
  popUpColor: 0,
  autoPlayPopUpBg: 2,
  homeSketch: 0,
  homeIcon: 1,
  border: 0,
  footer: 1,
  activeElem: 0,
  dashLine: 0,
  toolTipColor: 0,
  toolTipBg: 2,
  workIndex: 1,
  mediaPlayButton: 0,
  strokePrimary: 1,
  strokeSecondary: 0,
  strokePanto: 3,
  strokeCaption: 0,
  strokeClear: 1,
  vectorStringSketch: 3
}


loopObject(colors, (colorTarget, colorIndex) =>
  colors[colorTarget] = swatches[COLOR_PRESET][colorIndex])

export default colors

