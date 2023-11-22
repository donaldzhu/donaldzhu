import PageAcogito from '../../../components/desktop/workPages/pageAcogito'
import PageArchitecture from '../../../components/desktop/workPages/pageArchitecture'
import PageDm2020 from '../../../components/desktop/workPages/pageDm2020'
import PageGameStudies from '../../../components/desktop/workPages/pageGameStudies'
import PageIVoted from '../../../components/desktop/workPages/pageIVoted'
import PageMemoryOfMemories from '../../../components/desktop/workPages/pageMemoryOfMemories'
import PageObjectBulb from '../../../components/desktop/workPages/pageObjectBulb'
import PageRoll from '../../../components/desktop/workPages/pageRoll'
import PageSpin from '../../../components/desktop/workPages/pageSpin'
import PageStroke from '../../../components/desktop/workPages/pageStroke'
import PageSystemizedCreativity from '../../../components/desktop/workPages/pageSystemizedCreativity'
import PageThePoorImage from '../../../components/desktop/workPages/pageThePoorImage'
import PageThrasherReconstructed from '../../../components/desktop/workPages/pageThrasherReconstructed'
import PageVectorSpinStroke from '../../../components/desktop/workPages/pageVectorSpinStroke'
import PageVectorString from '../../../components/desktop/workPages/pageVectorString'
import PageVectorStruct from '../../../components/desktop/workPages/pageVectorStruct'

const workPages: Record<string, () => JSX.Element> = {
  'game-studies': PageGameStudies,
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