import { DashConfig } from './resizerTypes'

export const DASH_SUBFOLDER = 'dash'
export const POSTER_SUBFOLDER = 'posters'

export const DASH_CONFIGS: DashConfig[] = [
  {
    size: 240,
    bitrate: '400k',
    frameRate: 24
  },
  {
    size: 360,
    bitrate: '800k',
    frameRate: 24
  },
  {
    size: 480,
    bitrate: '1200k',
    frameRate: 24
  },
  {
    size: 720,
    bitrate: '2400k',
    frameRate: 30
  },
  {
    size: 720,
    bitrate: '4800k',
    frameRate: 30
  },
  {
    size: 1080,
    bitrate: '6400k',
    frameRate: 30
  },
  {
    size: 1080,
    bitrate: '8400k',
    frameRate: 30
  },
  {
    size: 1440,
    bitrate: '12000k',
    frameRate: 30
  },
  {
    size: 1440,
    bitrate: '16000k',
    frameRate: 30
  }
]