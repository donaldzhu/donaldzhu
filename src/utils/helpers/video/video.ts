import { validateRef } from '../../typeUtils'
import Queue from '../queue'

import type { MutableRefObject } from 'react'

class Video {
  private playQueue: Queue | undefined
  private playQueueList: VideoPlayCommand[]
  playState: {
    current: boolean
    future: boolean
    isSettled: boolean
  }

  constructor(
    public ref: MutableRefObject<HTMLVideoElement>,
    public canAutoPlay: boolean | undefined
  ) {
    this.playQueue = undefined
    this.playQueueList = []
    this.playState = {
      current: false,
      future: false,
      isSettled: true
    }
  }

  play() {
    if (!this.canAutoPlay || this.playState.future) return
    this.addToQueue(new VideoPlayCommand(
      true, () => {
        this.playQueueList.shift()
        return this.ref.current.play()
          .then(() => this.playState.current = true)
          .catch(err => console.error(err))
      }
    ))
  }

  pause() {
    if (!this.playState.future) return
    this.addToQueue(new VideoPlayCommand(
      false, () => {
        this.playQueueList.shift()
        if (validateRef(this.ref))
          this.ref.current.pause()
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
      this.playQueue.push(queueCommand)
      return
    }

    this.playQueueList.pop()
    this.playQueue.pop()
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
  constructor(public isPlayCommand: boolean, public run: () => void) { }
}

export default Video