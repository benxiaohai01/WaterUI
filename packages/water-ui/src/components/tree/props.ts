export interface TreeNode {
  /** 节点唯一标识 */
  key: string
  /** 节点标题 */
  label: string
  /** 子节点 */
  children?: TreeNode[]
  /** 是否禁用 */
  disabled?: boolean
  /** 是否默认展开 */
  defaultExpanded?: boolean
}

export interface TreeProps {
  /** 树数据 */
  data: TreeNode[]
  /** 是否多选 */
  multiple?: boolean
  /** 是否默认展开所有节点 */
  defaultExpandAll?: boolean
  /** 是否显示连接线 */
  showLine?: boolean
  /** 自定义类名 */
  customClass?: string
}

export interface TreeEmits {
  /** 节点点击 */
  nodeClick: [node: TreeNode]
  /** 选中变化 */
  change: [selectedKeys: string[]]
}
