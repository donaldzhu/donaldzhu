import { MutableRefObject } from 'react'

export interface ToolTipProps {
  toolTipRef?: MutableRefObject<HTMLDivElement | null>,
  popUpRef?: MutableRefObject<HTMLDivElement | null>,
}

export type WorkPageContextProps = {
  pageId: string
} & ToolTipProps
