import type { HighlightProps } from '../../utils/highlight'

export interface TableColumn {
  key: string
  title: string
  width?: string
  align?: 'left' | 'center' | 'right'
}

export interface TableProps extends HighlightProps {
  columns: TableColumn[]
  data: Array<Record<string, unknown>>
  /** 行唯一键：字符串时取 row[rowKey]，函数时返回键值；不传时回退行索引 */
  rowKey?: string | ((row: Record<string, unknown>) => string | number)
  bordered?: boolean
  striped?: boolean
  size?: 'small' | 'medium' | 'large'
  emptyText?: string
}
