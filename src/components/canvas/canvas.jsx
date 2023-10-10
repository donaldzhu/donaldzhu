import { useEffect, useRef } from 'react'
import { styled } from 'styled-components'
import p5 from 'p5'
import _ from 'lodash'
import { P5_EVENTS } from '../../utils/p5Utils'

let uuid = 0
const Canvas = ({ setup, className, children, ...eventHandlers }) => {
  const parentRef = useRef()
  const sketchRef = useRef()
  const toRemoveRef = useRef(new Set())

  useEffect(() => {
    if (!parentRef.current) return _.noop
    const _uuid = uuid

    sketchRef.current = new p5(p => {
      p.setup = () => {
        if (toRemoveRef.current.has(_uuid)) {
          p.remove()
          return toRemoveRef.current.delete(_uuid)
        }
        setup(p, parentRef.current)

        const { style } = p.canvas
        style.width = ''
        style.height = ''
      }

      p.draw = () => {
        if (p._loop) eventHandlers.draw(p)
      }

      Object.keys(P5_EVENTS).forEach(event => {
        if (eventHandlers[event] && event !== P5_EVENTS.draw)
          p[event] = (...args) => eventHandlers[event](p, ...args)
      })
    }, parentRef.current)

    uuid++
    const toRemoveRefCurr = toRemoveRef.current
    return () => {
      if (sketchRef.current.canvas) sketchRef.current.remove()
      else toRemoveRefCurr.add(_uuid)
    }
  }, [parentRef])

  return (
    <CanvasContainer ref={parentRef} className={className}>
      {children}
    </CanvasContainer>
  )
}

const CanvasContainer = styled.div`
  > canvas {
    width: 100%;
    height: 100%;
  }
`

export default Canvas