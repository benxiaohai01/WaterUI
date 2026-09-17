import { createApp, h, ref, type Ref } from 'vue'
import Notification from './Notification.vue'
import type { NotificationOptions, NotificationType } from './props'

/* 组件实现：首条通知距视口顶部偏移 */
const NOTIFICATION_BASE_OFFSET = 24
/* 组件实现：相邻通知的偏移步长（按通知高度估值） */
const NOTIFICATION_OFFSET_STEP = 96

/* 组件实现：活跃通知实例列表（每项持有偏移 ref，用于重排） */
const instances: Array<{ offset: Ref<number> }> = []

/* 交互处理逻辑：按活跃顺序重排所有通知偏移，避免越界与空洞 */
function relayout() {
  instances.forEach((item, index) => {
    item.offset.value = NOTIFICATION_BASE_OFFSET + index * NOTIFICATION_OFFSET_STEP
  })
}

/* 交互处理逻辑：卸载通知实例 */
function cleanupNotification(app: ReturnType<typeof createApp>, host: HTMLDivElement) {
  app.unmount()
  host.remove()
}

/* 组件实现：创建全局 Notification 实例 */
function openNotification(options: NotificationOptions) {
  /* SSR 守卫：无 document 环境不创建实例 */
  if (typeof document === 'undefined') return () => undefined
  const host = document.createElement('div')
  document.body.appendChild(host)
  const offset = ref(NOTIFICATION_BASE_OFFSET)
  const record = { offset }
  instances.push(record)
  relayout()
  const app = createApp({
    render: () =>
      h(Notification, {
        title: options.title,
        message: options.message,
        type: options.type ?? 'info',
        duration: options.duration ?? 4500,
        showClose: options.showClose ?? true,
        offset: offset.value,
        customClass: options.customClass,
        highlightSize: options.highlightSize,
        highlightOffset: options.highlightOffset,
        highlightOpacity: options.highlightOpacity,
        onClose: () => close()
      })
  })
  let active = true
  /* 交互处理逻辑：关闭当前通知（幂等，重复调用不二次卸载） */
  const close = () => {
    if (!active) return
    active = false
    cleanupNotification(app, host)
    const index = instances.indexOf(record)
    if (index >= 0) instances.splice(index, 1)
    relayout()
  }
  app.mount(host)
  return close
}

export interface NotificationFunction {
  (options: NotificationOptions): () => void
  success(message: string, options?: Omit<NotificationOptions, 'message' | 'type'>): () => void
  warning(message: string, options?: Omit<NotificationOptions, 'message' | 'type'>): () => void
  error(message: string, options?: Omit<NotificationOptions, 'message' | 'type'>): () => void
  info(message: string, options?: Omit<NotificationOptions, 'message' | 'type'>): () => void
}

/* 声明 notification 函数及其语义快捷方法 */
export const notification: NotificationFunction = ((
  options: NotificationOptions
) => openNotification(options)) as NotificationFunction

notification.success = (message, options?) =>
  openNotification({ message, type: 'success', ...options })

notification.warning = (message, options?) =>
  openNotification({ message, type: 'warning', ...options })

notification.error = (message, options?) =>
  openNotification({ message, type: 'error', ...options })

notification.info = (message, options?) =>
  openNotification({ message, type: 'info', ...options })

export type { NotificationType }
