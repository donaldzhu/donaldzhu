import { createContext } from 'react'
import { WorkPageContextProps } from './contextTypes'

export const WorkPageContext = createContext<WorkPageContextProps>({
  toolTipRef: undefined,
  popUpRef: undefined,
  pageId: '',
  previewLoaded: false
})