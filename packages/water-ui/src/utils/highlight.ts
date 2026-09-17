import { computed, type ComputedRef } from 'vue'

/**
 * 组件级高光参数：与全局配置（--wt-highlight-*）同名同义，
 * 显式传入时以组件参数为准（内联变量优先级高于全局与组件样式）。
 */
export interface HighlightProps {
  /** 主高光尺寸（数字按 px 处理，也可传 CSS 值） */
  highlightSize?: number | string
  /** 高光相对右上角的偏移（数字按 px 处理，也可传 CSS 值） */
  highlightOffset?: number | string
  /** 主高光透明度（0~1） */
  highlightOpacity?: number
}

const toCssValue = (value: number | string | undefined): string | undefined => {
  if (value === undefined) return undefined
  return typeof value === 'number' ? `${value}px` : value
}

/**
 * 生成高光参数对应的内联 CSS 变量，绑定到组件根元素即可覆盖全局配置。
 *
 * 优先级：组件 props（内联样式）> 组件样式 > 全局 `--wt-highlight-*` 配置。
 */
export function useHighlightStyle(props: HighlightProps): ComputedRef<Record<string, string>> {
  return computed(() => {
    const style: Record<string, string> = {}

    const size = toCssValue(props.highlightSize)
    if (size !== undefined) {
      style['--wt-highlight-size'] = size
      style['--wt-highlight-small-size'] = `calc(${size} * 0.5)`
    }

    const offset = toCssValue(props.highlightOffset)
    if (offset !== undefined) {
      style['--wt-highlight-inset'] = offset
      style['--wt-highlight-offset'] = offset
    }

    if (props.highlightOpacity !== undefined) {
      style['--wt-highlight-opacity'] = String(props.highlightOpacity)
      style['--wt-highlight-small-opacity'] = String(Math.max(0, props.highlightOpacity - 0.1))
    }

    return style
  })
}
