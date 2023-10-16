

class Video {
  constructor(ref, canAutoPlay) {
    this.ref = ref
    this.canAutoPlay = canAutoPlay
    this.playQueue = []
    this.currentPlayState = false
    this.resolvedPlayState = false
  }

  play() {
    this.playQueue.push(new VideoPlayCommand(true,
      () => this.ref.play()))
  }

  pause() {
    this.playQueue.push(new VideoPlayCommand(false,
      () => this.ref.pause()))
  }

  addToQueue() {

  }

  runQueue() {

  }

  get resolvedPlayState() {
    if (!this.playQueue.length)
      return this.currentPlayState
    return this.playQueue[this.playQueue.length - 1].doPlay
  }
}

class VideoPlayCommand {
  constructor(doPlay, command) {
    this.doPlay = doPlay
    this.command = command
  }

  execute() {
    return this.command()
  }
}

export default Video