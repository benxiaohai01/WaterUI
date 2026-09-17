import type { HighlightProps } from '../../utils/highlight'

export type LoadingSize = 'small' | 'medium' | 'large'

export interface LoadingProps extends HighlightProps {
  modelValue?: boolean
  text?: string
  fullscreen?: boolean
  size?: LoadingSize
  customClass?: string
}
