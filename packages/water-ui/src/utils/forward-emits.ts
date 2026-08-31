import { onBeforeUnmount } from 'vue'
import type { ComponentInternalInstance } from 'vue'

/**
 * 将「父组件 emit 集合」与「子组件 emit 集合」合并。
 *
 * 使用场景：子组件内部自行注册事件（如 `<div @click>`）时，
 * 需要把父组件通过 attrs 透传下来的监听器（如 `@click`）一并转发，
 * 否则父组件的监听器会被子组件内部的监听器覆盖。
 */
export function forwardEmits(
  instance: ComponentInternalInstance,
  ...sources: Array<Record<string, unknown> | undefined>
): () => void {
  const listeners: Record<string, unknown> = {}
  const entries = sources.filter(Boolean) as Record<string, unknown>[]

  for (const source of entries) {
    for (const key of Object.keys(source)) {
      const value = source[key]
      if (typeof value === 'function') {
        const existing = listeners[key]
        listeners[key] = existing
          ? (...args: unknown[]) => {
              ;(existing as (...a: unknown[]) => void)(...args)
              ;(value as (...a: unknown[]) => void)(...args)
            }
          : value
      }
    }
  }

  const off = instance.vnode.props
    ? Object.entries(instance.vnode.props)
        .filter(([key]) => key.startsWith('on'))
        .map(([key, handler]) => {
          const eventName = key.slice(2).toLowerCase()
          if (typeof handler === 'function' && listeners[eventName]) {
            listeners[eventName] = (...args: unknown[]) => {
              ;(listeners[eventName] as (...a: unknown[]) => void)(...args)
              ;(handler as (...a: unknown[]) => void)(...args)
            }
          }
          return () => undefined
        })
    : []

  const cleanup = () => {
    off.forEach((fn) => fn())
  }

  onBeforeUnmount(cleanup)
  return cleanup
}
