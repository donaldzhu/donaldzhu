import Queue from '../queue'
import { validateRef } from '../../typeUtils'
import type { MutableRefObject } from 'react'
import type { MediaPlayerClass } from 'dashjs'

class Video {
  private playQueue: Queue | undefined
  private playQueueList: VideoPlayCommand[]
  vidRef: MutableRefObject<HTMLVideoElement>
  dashPlayerRef: MutableRefObject<MediaPlayerClass | null>
  useDash: boolean
  canAutoPlay: boolean | undefined
  playerInitializedRef: MutableRefObject<boolean>

  playState: {
    current: boolean
    future: boolean
    isSettled: boolean
  }

  constructor(
    vidRef: MutableRefObject<HTMLVideoElement>,
    dashPlayerRef: MutableRefObject<MediaPlayerClass | null>,
    useDash: boolean,
    canAutoPlay: boolean | undefined,
    playerInitializedRef: MutableRefObject<boolean>
  ) {
    this.vidRef = vidRef
    this.dashPlayerRef = dashPlayerRef
    this.useDash = useDash
    this.canAutoPlay = canAutoPlay
    this.playerInitializedRef = playerInitializedRef

    this.playQueue = undefined
    this.playQueueList = []
    this.playState = {
      current: false,
      future: false,
      isSettled: true
    }
  }

  play() {
    if (!this.canAutoPlay) return
    if (this.useDash) {
      if (validateRef(this.dashPlayerRef))
        this.dashPlayerRef.current.play()
    }
    else this.nativePlay()
  }

  pause() {
    if (this.useDash) {
      if (validateRef(this.dashPlayerRef))
        this.dashPlayerRef.current.pause()
    }
    else this.nativePause()
  }

  private nativePlay() {
    if (this.playState.future) return
    this.addToQueue(new VideoPlayCommand(
      true, () => {
        this.playQueueList.shift()

        return this.vidRef.current.play()
          .then(() => this.playState.current = true)
          .catch(err => console.error(err))
      }
    ))
  }

  private nativePause() {
    if (!this.playState.future) return
    this.addToQueue(new VideoPlayCommand(
      false, () => {
        this.playQueueList.shift()
        if (validateRef(this.vidRef))
          this.vidRef.current.pause()
        this.playState.current = false
      }
    ))
  }

  private addToQueue(queueCommand: VideoPlayCommand) {
    this.parseNewCommand(queueCommand)
    this.setFuturePlayState(queueCommand.isPlayCommand)
  }

  private parseNewCommand(queueCommand: VideoPlayCommand) {
    if (!this.playQueue) {
      if (this.playState.current === queueCommand.isPlayCommand) return
      this.playQueue = new Queue(0)
      this.playState.isSettled = false
      this.playQueueList = [queueCommand]
      return this.playQueue.create([queueCommand])
        .then(() => this.onPlayStateSettle())
        .catch(() => this.onPlayStateSettle())
    }

    // future === isPlayCommand caught by higher filters
    if (!this.playQueueList.length) {
      this.playQueueList.push(queueCommand)
      this.playQueue.queueList.push(queueCommand)
      return
    }

    this.playQueueList.pop()
    this.playQueue.queueList.pop()
  }

  private setFuturePlayState(isPlayCommand: boolean) {
    this.playState.future = isPlayCommand
  }

  private onPlayStateSettle() {
    this.playQueue = undefined
    this.playState.isSettled = true
  }
}

class VideoPlayCommand {
  isPlayCommand: boolean
  run: () => void
  constructor(isPlayCommand: boolean, run: () => void) {
    this.isPlayCommand = isPlayCommand
    this.run = run
  }
}

export default Video