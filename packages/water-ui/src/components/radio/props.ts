export type RadioValue = string | number | boolean

export interface RadioProps {
  modelValue?: RadioValue
  value: RadioValue
  name?: string
  disabled?: boolean
  customClass?: string
}
