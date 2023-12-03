import { useEffect } from 'react'
import styled from 'styled-components'
import { typedKeys } from '../../../utils/commonUtils'
import mixins from '../../../styles/mixins'
import Vid from './vid'
import type { RouteProps } from '../../routeTypes'
import type { Verbosity } from '../../../utils/helpers/preloader/preloadUtils'

type VidLoadContainerProps = {
  isMobile?: boolean,
  verbosity?: Verbosity,
  hasZoomedMedia?: boolean
} & Pick<RouteProps['mediaSettings'], 'canAutoPlay' | 'vidLoadData'>

const VidLoadContainer = ({
  isMobile,
  hasZoomedMedia,
  vidLoadData,
  canAutoPlay,
  verbosity
}: VidLoadContainerProps) => {
  const shouldPause = isMobile && hasZoomedMedia
  const hasVidLoadData = !!Object.keys(vidLoadData).length

  useEffect(() => {
    if (
      hasVidLoadData &&
      isMobile &&
      verbosity &&
      verbosity >= 2
    ) console.log(`${shouldPause ? 'Zoomed' : 'Unzoomed'} media %c- ${shouldPause ?
      'pausing' : 'resuming'} video load...`, 'color: gray; font-style: italic;', typedKeys(vidLoadData))
  }, [hasZoomedMedia])

  return (
    hasVidLoadData &&
    <Container>
      {!shouldPause && typedKeys(vidLoadData)
        .map(src => {
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