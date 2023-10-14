import { MutableRefObject } from 'react'

export interface ToolTipProps {
  toolTipRef?: MutableRefObject<HTMLDivElement>,
  popUpRef?: MutableRefObject<HTMLDivElement>,
}

export type WorkPageContextProps = {
  pageId: string
} & ToolTipProps
