import type { HighlightProps } from '../../utils/highlight'

export type AutocompleteSize = 'small' | 'medium' | 'large'

export interface AutocompleteOption {
  label: string
  value: string | number
}

export interface AutocompleteProps extends HighlightProps {
  modelValue?: string | number
  suggestions?: Array<string | AutocompleteOption>
  placeholder?: string
  disabled?: boolean
  clearable?: boolean
  size?: AutocompleteSize
  customClass?: string
}
