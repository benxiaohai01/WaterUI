export type AutocompleteSize = 'small' | 'medium' | 'large'

export interface AutocompleteOption {
  label: string
  value: string | number
}

export interface AutocompleteProps {
  modelValue?: string | number
  suggestions?: Array<string | AutocompleteOption>
  placeholder?: string
  disabled?: boolean
  clearable?: boolean
  size?: AutocompleteSize
  customClass?: string
}
