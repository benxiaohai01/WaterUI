export interface TransferItem {
  key: string | number
  label: string
  disabled?: boolean
}

export interface TransferProps {
  modelValue?: Array<string | number>
  data: TransferItem[]
  titles?: [string, string]
  disabled?: boolean
  customClass?: string
}
