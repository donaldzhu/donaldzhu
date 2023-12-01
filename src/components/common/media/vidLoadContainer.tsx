import styled from 'styled-components'
import { typedKeys } from '../../../utils/commonUtils'
import mixins from '../../../styles/mixins'
import Vid from './vid'
import type { RouteProps } from '../../routeTypes'

const VidLoadContainer = ({
  vidLoadData,
  canAutoPlay
}: Pick<RouteProps['mediaSettings'], 'canAutoPlay' | 'vidLoadData'>) => {
  return (
    !!Object.keys(vidLoadData).length &&
    <Container>
      {typedKeys(vidLoadData).map(src => {
        const { onProgress } = vidLoadData[src]
        return <Vid
          key={src}
          src={src}
          preload='true'
          autoPlay={true}
          canAutoPlay={canAutoPlay}
          useNativeControl={true}
          onProgress={onProgress}
          onCanPlayThrough={onProgress}
          onTimeUpdate={onProgress} />
      })}
    </Container>
  )
}


const Container = styled.div`
  ${mixins.fixed()}
  visibility: hidden;
`

export default VidLoadContainer