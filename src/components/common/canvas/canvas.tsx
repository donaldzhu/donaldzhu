import { forwardRef, useEffect, useRef } from 'react'
import _ from 'lodash'
import p5 from 'p5'
import styled from 'styled-components'
import { mapObject, typedKeys } from '../../../utils/commonUtils'
import { P5Event } from '../../../utils/p5Utils'
import { validateRef } from '../../../utils/typeUtils'
import useMergedRef from '../../../hooks/useMergedRef'
import useForwardedRef from '../../../hooks/useForwaredRef'
import type { ReactNode } from 'react'
import type { P5EventHandlers } from './canvasTypes'

interface CanvasProps {
  setup?: (p: p5) => void
  className?: string
  children?: ReactNode
}

let uuid = 0
const Canvas = forwardRef<HTMLDivElement, CanvasProps & Partial<P5EventHandlers>>(
  ({ setup, className, children, ...eventHandlers }, ref
  ) => {
    const forwaredRef = useForwardedRef(ref)
    const parentRef = useMergedRef<HTMLDivElement>(forwaredRef)
    const sketchRef = useRef<p5>()
    const toRemoveRef = useRef(new Set())

    const defaultEventCallbacks: P5EventHandlers = mapObject(P5Event, () => _.noop)
    const defaultEventHandlers: P5EventHandlers = _.defaults(eventHandlers, defaultEventCallbacks)

    useEffect(() => {
      if (!parentRef.current) return _.noop
      const _uuid = uuid

      sketchRef.current = new p5(p => {
        p.setup = () => {
          if (!validateRef(parentRef)) return
          if (toRemoveRef.current.has(_uuid)) {
            p.remove()
            return toRemoveRef.current.delete(_uuid)
          }

          const parent = parentRef.current
          if (setup) setup(p)
          const { width, height } = parent.getBoundingClientRect()
          p.createCanvas(width, height)
        }

        p.draw = () => {
          if (p._loop) {
            p.clear(0, 0, 0, 0)
            defaultEventHandlers.draw(p)
          }
        }

        p.windowResized = () => {
          defaultEventHandlers.windowResized(p)
          if (!validateRef(parentRef)) return
          const parent = parentRef.current
          const { width, height } = parent.getBoundingClientRect()
          p.resizeCanvas(width, height)
        }

        typedKeys<P5Event>(P5Event).forEach(event => {
          if (defaultEventHandlers[event] &&
            event !== P5Event.draw &&
            event !== P5Event.windowResized
          )
            p[event] = (nativeEvent?: Event | UIEvent) =>
              defaultEventHandlers[event](p, nativeEvent)
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
      <Container ref={parentRef} className={className}>
        {children}
      </Container>
    )
  })

const Container = styled.div`
  canvas {
    position: absolute;
  }
`

export default Canvas