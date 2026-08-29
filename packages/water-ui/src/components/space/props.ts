export type SpaceDirection = 'horizontal' | 'vertical'
export type SpaceAlign = 'start' | 'center' | 'end' | 'baseline'
export type SpaceJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'

export interface SpaceProps {
  direction?: SpaceDirection
  size?: number | string
  wrap?: boolean
  align?: SpaceAlign
  justify?: SpaceJustify
  customClass?: string
}
