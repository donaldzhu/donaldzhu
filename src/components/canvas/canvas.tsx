import { ReactNode, useEffect, useRef } from 'react'
import { styled } from 'styled-components'
import p5 from 'p5'
import _ from 'lodash'
import { P5Events } from '../../utils/p5Utils'
import { typedKeys } from '../../utils/commonUtils'
import { p5EventHandlers } from './canvasTypes'


interface CanvasProps {
  setup: (p: p5, parent: HTMLDivElement) => void
  className?: string
  children?: ReactNode
}

let uuid = 0
const Canvas = ({ setup, className, children, ...eventHandlers }:
  CanvasProps & p5EventHandlers
) => {
  const parentRef = useRef<HTMLDivElement>(null)
  const sketchRef = useRef<p5>()
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

        if (!parentRef.current) return
        setup(p, parentRef.current)

        const { style } = p.canvas
        style.width = ''
        style.height = ''
      }

      p.draw = () => {
        if (p._loop) eventHandlers.draw(p)
      }

      typedKeys<P5Events>(P5Events).forEach(event => {
        if (eventHandlers[event] && event !== P5Events.draw)
          p[event] = (nativeEvent?: Event | UIEvent) => eventHandlers[event](p, nativeEvent)
      })
    }, parentRef.current)

    uuid++
    const toRemoveRefCurr = toRemoveRef.current
    return () => {
      if (sketchRef.current?.canvas) sketchRef.current.remove()
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