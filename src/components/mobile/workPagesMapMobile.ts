import { WorkPageMobileProps } from './workPageTypes'
import PageAcogitoMobile from './workPages/pageAcogitoMobile'
import PageArchitectureMobile from './workPages/pageArchitectureMobile'
import PageDm2020Mobile from './workPages/pageDm2020Mobile'
import PageGameStudiesMobile from './workPages/pageGameStudiesMobile'
import PageIVotedMobile from './workPages/pageIVotedMobile'
import PageMemoryOfMemoriesMobile from './workPages/pageMemoryOfMemoriesMobile'
import PageObjectBulbMobile from './workPages/pageObjectBulbMobile'
import PageRollMobile from './workPages/pageRollMobile'
import PageSpinMobile from './workPages/pageSpinMobile'
import PageStrokeMobile from './workPages/pageStrokeMobile'
import PageSystemizedCreativityMobile from './workPages/pageSystemizedCreativityMobile'
import PageThePoorImageMobile from './workPages/pageThePoorImageMobile'
import PageThrasherReconstructedMobile from './workPages/pageThrasherReconstructedMobile'
import PageVectorSpinStrokeMobile from './workPages/pageVectorSpinStrokeMobile'
import PageVectorStringMobile from './workPages/pageVectorStringMobile'
import PageVectorStructMobile from './workPages/pageVectorStructMobile'

// TODO: merge with desktop
const workPagesMobile: Record<string, (props: WorkPageMobileProps) => JSX.Element> = {
  'game-studies': PageGameStudiesMobile,
  'vector-spin-stroke': PageVectorSpinStrokeMobile,
  'vector-struct': PageVectorStructMobile,
  'vector-string': PageVectorStringMobile,
  'spin': PageSpinMobile,
  'roll': PageRollMobile,
  'stroke': PageStrokeMobile,
  'memory-of-memories': PageMemoryOfMemoriesMobile,
  'thrasher-reconstructed': PageThrasherReconstructedMobile,
  'systemized-creativity': PageSystemizedCreativityMobile,
  'acogito': PageAcogitoMobile,
  'i-voted': PageIVotedMobile,
  'dm2020': PageDm2020Mobile,
  'the-poor-image': PageThePoorImageMobile,
  'architecture': PageArchitectureMobile,
  'object-bulb': PageObjectBulbMobile,
}

export default workPagesMobile