export interface UploadFile {
  name: string
  size?: number
  status?: 'ready' | 'success' | 'fail'
  url?: string
}

export interface UploadProps {
  modelValue?: UploadFile[]
  accept?: string
  multiple?: boolean
  disabled?: boolean
  customClass?: string
}
