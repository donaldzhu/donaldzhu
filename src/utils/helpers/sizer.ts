import breakpts from '../../data/breakpoints'

type breakptSizesType = Partial<Record<keyof typeof breakpts, number>>

class Sizer {
  breakptSizes: breakptSizesType
  constructor(breakptSizes: breakptSizesType) {
    this.breakptSizes = breakptSizes
  }
}

export default Sizer