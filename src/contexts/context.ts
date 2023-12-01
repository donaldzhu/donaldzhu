import { createContext } from 'react'
import type { WorkPageContextProps } from './contextTypes'

export const WorkPageContext = createContext<WorkPageContextProps>({
  toolTipRef: undefined,
  popUpRef: undefined,
  pageId: ''
})
