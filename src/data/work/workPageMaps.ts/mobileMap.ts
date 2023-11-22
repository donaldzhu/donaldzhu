import PageAcogito from '../../../components/mobile/workPages/pageAcogito'
import PageArchitecture from '../../../components/mobile/workPages/pageArchitecture'
import PageDm2020 from '../../../components/mobile/workPages/pageDm2020'
import PageGameStudies from '../../../components/mobile/workPages/pageGameStudies'
import PageIVoted from '../../../components/mobile/workPages/pageIVoted'
import PageMemoryOfMemories from '../../../components/mobile/workPages/pageMemoryOfMemories'
import PageObjectBulb from '../../../components/mobile/workPages/pageObjectBulb'
import PageRoll from '../../../components/mobile/workPages/pageRoll'
import PageSpin from '../../../components/mobile/workPages/pageSpin'
import PageStroke from '../../../components/mobile/workPages/pageStroke'
import PageSystemizedCreativity from '../../../components/mobile/workPages/pageSystemizedCreativity'
import PageThePoorImage from '../../../components/mobile/workPages/pageThePoorImage'
import PageThrasherReconstructed from '../../../components/mobile/workPages/pageThrasherReconstructed'
import PageVectorSpinStroke from '../../../components/mobile/workPages/pageVectorSpinStroke'
import PageVectorString from '../../../components/mobile/workPages/pageVectorString'
import PageVectorStruct from '../../../components/mobile/workPages/pageVectorStruct'
import type { WorkPageContentProps } from '../../../components/mobile/work/workPageTypes'

const workPages: Record<string, (props: WorkPageContentProps) => JSX.Element> = {
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