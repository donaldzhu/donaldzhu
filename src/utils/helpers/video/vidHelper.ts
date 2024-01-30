import dashjs from 'dashjs'
import Queue from '../queue'
import { validateRef } from '../../typeUtils'
import type { MutableRefObject } from 'react'
import type { MediaPlayerClass } from 'dashjs'

enum PlayState {
  Play = 'play',
  Pause = 'pause'
}

class VidHelper {
  private playQueue: Queue | undefined
  private vidCommands: VidCommand[]
  private vidRef: MutableRefObject<HTMLVideoElement>
  private dashPlayerRef: MutableRefObject<MediaPlayerClass | null>
  private useDash: boolean

  private seeked: boolean
  private zoomedMediaShouldCatchup: boolean // TODO
  private playState: {
    current: PlayState
    future: PlayState
  }

  enabled: boolean | undefined

  constructor(
    vidRef: MutableRefObject<HTMLVideoElement>,
    dashPlayerRef: MutableRefObject<MediaPlayerClass | null>,
    useDash: boolean,
    canPlay: boolean | undefined
  ) {
    this.vidRef = vidRef
    this.dashPlayerRef = dashPlayerRef

    this.useDash = useDash
    this.seeked = false
    this.zoomedMediaShouldCatchup = false

    this.playQueue = undefined
    this.vidCommands = []
    this.playState = {
      current: PlayState.Pause,
      future: PlayState.Pause
    }

    this.enabled = canPlay
  }

  onVidCanPlay<T>(callback: () => T) {
    const toggleListener = (isInit: boolean) => {
      if (this.useDash) {
        if (validateRef(this.dashPlayerRef))
          this.dashPlayerRef.current[isInit ? 'on' : 'off']('canPlay', callback)
      }

      else if (validateRef(this.vidRef)) this.vidRef.current[
        isInit ? 'addEventListener' : 'removeEventListener'
      ]('canplay', callback)
    }

    toggleListener(true)
    return () => toggleListener(false)
  }

  play() {
    this.toggle(PlayState.Play)
  }

  pause() {
    this.toggle(PlayState.Pause)
    console.log('pause')
  }

  catchup(currentTime?: number) {
    if (!currentTime || !this.zoomedMediaShouldCatchup) return
    if (this.useDash) this.dashCatchup(currentTime)
    else this.nativeCatchup(currentTime)
  }

  private toggle(playState: PlayState) {
    if (!this.enabled) return
    if (this.useDash) this.dashToggle(playState)
    else this.nativeToggle(playState)
  }

  private dashToggle(playState: PlayState) {
    if (validateRef(this.dashPlayerRef))
      this.dashPlayerRef.current[playState]()
  }

  private nativeToggle(playState: PlayState) {
    if (playState === PlayState.Play) this.nativePlay()
    else this.nativePause()
  }

  private nativePlay() {
    if (this.playState.future === PlayState.Play) return
    this.addToQueue(PlayState.Play, () =>
      this.vidRef.current.play()
        .then(() => this.playState.current = PlayState.Play)
        .catch(err => console.error(err))
    )
  }

  private nativePause() {
    if (this.playState.future === PlayState.Pause) return
    this.addToQueue(PlayState.Pause, () => {
      if (validateRef(this.vidRef))
        this.vidRef.current.pause()
      this.playState.current = PlayState.Pause
    })
  }

  private nativeCatchup(currentTime: number) {
    this.vidRef.current.currentTime = currentTime
    this.play()
  }

  private dashCatchup(currentTime: number) {
    if (!validateRef(this.dashPlayerRef)) return
    const player = this.dashPlayerRef.current
    player.on('playbackStarted', () => {
      if (this.seeked) return
      this.seeked = true
      player.seek(currentTime)
    })
  }

  private addToQueue(playState: PlayState, run: () => void) {
    const queueCommand = new VidCommand(playState, () => {
      this.vidCommands.shift()
      run()
    })
    this.parseNewCommand(queueCommand)
    this.setFuturePlayState(queueCommand.playState)
  }

  private parseNewCommand(queueCommand: VidCommand) {
    // there is no current queue
    if (!this.playQueue) {
      if (this.playState.current === queueCommand.playState) return
      this.playQueue = new Queue()

      this.vidCommands = [queueCommand]
      return this.playQueue.create([queueCommand])
        .then(() => this.playQueue = undefined)
        .catch(() => this.playQueue = undefined)
    }

    // there is an empty queue -
    // last command is being processed
    if (!this.vidCommands.length) {
      this.vidCommands.push(queueCommand)
      this.playQueue.push(queueCommand)
      return
    }

    // there is an occupied queue -
    // the one command in the queue is opposite of the incoming command,
    // so we cancel them out (pop the last command) without pushing the new one
    this.vidCommands.pop()
    this.playQueue.pop()
  }

  private setFuturePlayState(playState: PlayState) {
    this.playState.future = playState
  }

  static get canUseDash() {
    return dashjs.supportsMediaSource()
  }
}

class VidCommand {
  playState: PlayState
  run: () => void
  constructor(playState: PlayState, run: () => void) {
    this.playState = playState
    this.run = run
  }
}

export default VidHelper