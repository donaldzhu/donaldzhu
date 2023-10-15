import { MutableRefObject } from 'react'
import { WorkDataInterface } from './workIndex'

export interface ToolTipProps {
  toolTipRef?: MutableRefObject<HTMLDivElement | null>,
  popUpRef?: MutableRefObject<HTMLDivElement | null>,
}

export type WorkPageContextProps = {
  pageId: string
} & ToolTipProps

export interface WorkAnchorProps {
  data: WorkDataInterface
  isHighlighted: boolean
  highlightedRef: MutableRefObject<HTMLAnchorElement | null>
  handleHover: (projectTitle: string) => void
}