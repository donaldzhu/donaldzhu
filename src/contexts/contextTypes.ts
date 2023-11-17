import { ToolTipProps } from '../components/work/workTypes'

export type WorkPageContextProps = {
  pageId: string
  previewLoaded?: boolean
} & Partial<ToolTipProps>
