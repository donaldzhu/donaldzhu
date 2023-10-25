import { DependencyList, useEffect, useMemo } from 'react'
import { Composite, Engine } from 'matter-js'


const usePhysics = (dependencies?: DependencyList) => {
  const engine = useMemo(Engine.create, dependencies)

  useEffect(() => () => {
    Composite.clear(engine.world, true)
    Engine.clear(engine)
  }, dependencies)

  return engine
}

export default usePhysics