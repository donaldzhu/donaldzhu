import { createContext } from 'react'
import { WorkPageContextProps } from '../components/work/workTypes'

export const WorkPageContext = createContext<WorkPageContextProps>({
  toolTipRef: undefined,
  popUpRef: undefined,
  pageId: '',
  previewLoaded: false
})