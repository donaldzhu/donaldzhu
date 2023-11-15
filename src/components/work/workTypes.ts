import { MutableRefObject } from 'react'

export interface WorkDataInterface {
  id: string
  title: string
  abbr: string | null
  date: string
  tags: string[]
  medium: string[]
  animatedThumbnail: boolean
  enabled: boolean
  listed: boolean
}

export interface ToolTipProps {
  toolTipRef?: MutableRefObject<HTMLDivElement | null>,
  popUpRef?: MutableRefObject<HTMLDivElement | null>,
}

export interface WorkAnchorProps {
  data: WorkDataInterface
  isHighlighted: boolean
  highlightedRef: MutableRefObject<HTMLAnchorElement | null>
  handleHover: (projectTitle: string) => void
}