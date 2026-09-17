import type { HighlightProps } from '../../utils/highlight'

export interface UploadFile {
  name: string
  size?: number
  status?: 'ready' | 'success' | 'fail'
  url?: string
}

export interface UploadProps extends HighlightProps {
  modelValue?: UploadFile[]
  accept?: string
  multiple?: boolean
  disabled?: boolean
  customClass?: string
}
