import PageDm2020 from '../../components/workPages/pageDm2020'
import PageObjectBulb from '../../components/workPages/pageObjectBulb'
import PageArchitecture from '../../components/workPages/pageArchitecture'
import PageThePoorImage from '../../components/workPages/pageThePoorImage'
import PageIVoted from '../../components/workPages/pageIVoted'
import PageAcogito from '../../components/workPages/pageAcogito'
import PageSystemizedCreativity from '../../components/workPages/pageSystemizedCreativity'
import PageThrasherReconstructed from '../../components/workPages/pageThrasherReconstructed'
import PageMemoryOfMemories from '../../components/workPages/pageMemoryOfMemories'
import PageStroke from '../../components/workPages/pageStroke'
import PageRoll from '../../components/workPages/pageRoll'
import PageSpin from '../../components/workPages/pageSpin'
import PageVectorString from '../../components/workPages/pageVectorString'
import PageVectorStruct from '../../components/workPages/pageVectorStruct'
import PageVectorSpinStroke from '../../components/workPages/pageVectorSpinStroke'

const workPages: Record<string, () => JSX.Element> = {
  'vector-spin-stroke': PageVectorSpinStroke,
  'vector-struct': PageVectorStruct,
  'vector-string': PageVectorString,
  'spin': PageSpin,
  'roll': PageRoll,
  'stroke': PageStroke,
  'memory-of-memories': PageMemoryOfMemories,
  'thrasher-reconstructed': PageThrasherReconstructed,
  'systemized-creativity': PageSystemizedCreativity,
  'acogito': PageAcogito,
  'i-voted': PageIVoted,
  'dm2020': PageDm2020,
  'the-poor-image': PageThePoorImage,
  'architecture': PageArchitecture,
  'object-bulb': PageObjectBulb,
}

export default workPages