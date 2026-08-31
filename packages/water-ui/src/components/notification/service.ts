import { createApp, h } from 'vue'
import Notification from './Notification.vue'
import type { NotificationOptions, NotificationType } from './props'

/* 组件实现：通知实例的暂存节点 */
let nextOffset = 24

/* 交互处理逻辑：卸载通知实例 */
function cleanupNotification(app: ReturnType<typeof createApp>, host: HTMLDivElement) {
  app.unmount()
  host.remove()
}

/* 组件实现：创建全局 Notification 实例 */
function openNotification(options: NotificationOptions) {
  const host = document.createElement('div')
  document.body.appendChild(host)
  const offset = nextOffset
  nextOffset += 96
  const app = createApp({
    render: () =>
      h(Notification, {
        title: options.title,
        message: options.message,
        type: options.type ?? 'info',
        duration: options.duration ?? 4500,
        showClose: options.showClose ?? true,
        offset,
        customClass: options.customClass,
        onClose: () => cleanupNotification(app, host)
      })
  })
  app.mount(host)
  return () => cleanupNotification(app, host)
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
