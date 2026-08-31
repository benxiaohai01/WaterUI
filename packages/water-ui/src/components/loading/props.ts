export type LoadingSize = 'small' | 'medium' | 'large'

export interface LoadingProps {
  modelValue?: boolean
  text?: string
  fullscreen?: boolean
  size?: LoadingSize
  customClass?: string
}
