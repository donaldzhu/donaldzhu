import PageAcogito from '../../components/workPages/pageAcogito'
import PageArchitecture from '../../components/workPages/pageArchitecture'
import PageDm2020 from '../../components/workPages/pageDm2020'
import PageGameStudies from '../../components/workPages/pageGameStudies'
import PageIVoted from '../../components/workPages/pageIVoted'
import PageMemoryOfMemories from '../../components/workPages/pageMemoryOfMemories'
import PageObjectBulb from '../../components/workPages/pageObjectBulb'
import PageRoll from '../../components/workPages/pageRoll'
import PageSpin from '../../components/workPages/pageSpin'
import PageStroke from '../../components/workPages/pageStroke'
import PageSystemizedCreativity from '../../components/workPages/pageSystemizedCreativity'
import PageThePoorImage from '../../components/workPages/pageThePoorImage'
import PageThrasherReconstructed from '../../components/workPages/pageThrasherReconstructed'
import PageVectorSpinStroke from '../../components/workPages/pageVectorSpinStroke'
import PageVectorString from '../../components/workPages/pageVectorString'
import PageVectorStruct from '../../components/workPages/pageVectorStruct'

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