export type CascaderSize = 'small' | 'medium' | 'large'

export interface CascaderOption {
  value: string | number
  label: string
  children?: CascaderOption[]
  disabled?: boolean
}

export interface CascaderProps {
  modelValue?: Array<string | number>
  options: CascaderOption[]
  placeholder?: string
  disabled?: boolean
  clearable?: boolean
  size?: CascaderSize
  customClass?: string
}
