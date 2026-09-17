import type { HighlightProps } from '../../utils/highlight'

export interface TransferItem {
  key: string | number
  label: string
  disabled?: boolean
}

export interface TransferProps extends HighlightProps {
  modelValue?: Array<string | number>
  data: TransferItem[]
  titles?: [string, string]
  disabled?: boolean
  customClass?: string
}
