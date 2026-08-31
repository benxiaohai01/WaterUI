import { createApp, h } from 'vue'
import Message from './Message.vue'
import type { MessageOptions, MessageType } from './props'

/* 交互处理逻辑：卸载消息实例并清理挂载节点 */
function cleanup(app: ReturnType<typeof createApp>, host: HTMLDivElement) {
  app.unmount()
  host.remove()
}

/* 组件实现：创建全局 Message 实例 */
function openMessage(options: MessageOptions) {
  const host = document.createElement('div')
  document.body.appendChild(host)
  const app = createApp({
    render: () =>
      h(Message, {
        message: options.message,
        type: options.type ?? 'info',
        duration: options.duration ?? 3000,
        showClose: options.showClose ?? false,
        customClass: options.customClass,
        onClose: () => cleanup(app, host)
      })
  })
  app.mount(host)
  return () => cleanup(app, host)
}

export interface MessageFunction {
  (input: string | MessageOptions): () => void
  success(text: string, options?: Omit<MessageOptions, 'message' | 'type'>): () => void
  warning(text: string, options?: Omit<MessageOptions, 'message' | 'type'>): () => void
  error(text: string, options?: Omit<MessageOptions, 'message' | 'type'>): () => void
  info(text: string, options?: Omit<MessageOptions, 'message' | 'type'>): () => void
}

/* 声明 message 函数及其语义快捷方法 */
export const message: MessageFunction = ((
  input: string | MessageOptions
) => {
  const options: MessageOptions =
    typeof input === 'string' ? { message: input } : input
  return openMessage(options)
}) as MessageFunction

message.success = (text, options?) =>
  openMessage({ message: text, type: 'success', ...options })

message.warning = (text, options?) =>
  openMessage({ message: text, type: 'warning', ...options })

message.error = (text, options?) =>
  openMessage({ message: text, type: 'error', ...options })

message.info = (text, options?) =>
  openMessage({ message: text, type: 'info', ...options })

export type { MessageType }
