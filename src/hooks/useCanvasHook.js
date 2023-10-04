import { useOutletContext } from 'react-router-dom'

const useCanvasHook = ({
  canvasType = 'front',
  canvas,
  canvasRefs,
}) => {
  const outletContext = useOutletContext()
  if (!canvas) {
    canvas = outletContext.canvases[canvasType]
    canvasRefs = outletContext.canvasRefs
  }
  return { canvas, canvasRefs }
}

export default useCanvasHook