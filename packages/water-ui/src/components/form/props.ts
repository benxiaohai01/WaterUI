export type FormRuleType = 'string' | 'number' | 'boolean'

export interface FormRule {
  required?: boolean
  message?: string
  min?: number
  max?: number
  pattern?: RegExp
  type?: FormRuleType
  validator?: (value: unknown) => boolean | string
}

export interface FormProps {
  model?: Record<string, unknown>
  rules?: Record<string, FormRule | FormRule[]>
  labelWidth?: string
  labelPosition?: 'left' | 'top'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  inline?: boolean
}
