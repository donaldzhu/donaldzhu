import type { ToolTipProps } from '../components/desktop/work/workTypes'

export type WorkPageContextProps = {
  pageId: string
  previewLoaded?: boolean
} & Partial<ToolTipProps>
