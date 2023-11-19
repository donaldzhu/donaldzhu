
// TODO:
// 1. currently mobile centric
// 2. isolate logic
// 3. image only

import { useState } from 'react'
import styled from 'styled-components'
import WorkImg from './workImg'

interface CarouselProps {
  srcs: string[]
}

const Carousel = ({ srcs }: CarouselProps) => {
  const [index, setIndex] = useState(0)

  return (
    <Container>
      {srcs.map((src, i) => <WorkImg src={src} key={i} />)}
    </Container>
  )
}

const Container = styled.div`

`

export default Carousel