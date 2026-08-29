export interface TableColumn {
  key: string
  title: string
  width?: string
  align?: 'left' | 'center' | 'right'
}

export interface TableProps {
  columns: TableColumn[]
  data: Array<Record<string, unknown>>
  bordered?: boolean
  striped?: boolean
  size?: 'small' | 'medium' | 'large'
  emptyText?: string
}
