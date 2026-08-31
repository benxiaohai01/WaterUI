let uid = 0

/**
 * 生成稳定的组件实例内唯一 id（用于 a11y 关联、key 去重等）。
 * 前缀固定为 `wt`，避免与用户自定义 id 冲突。
 */
export function useUid(prefix = 'wt'): string {
  uid += 1
  return `${prefix}-${uid}`
}
