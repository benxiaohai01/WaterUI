import { createApp, h, ref, type Ref } from 'vue'
import Message from './Message.vue'
import type { MessageOptions, MessageType } from './props'

/* 组件实现：首条消息距视口顶部偏移 */
const MESSAGE_BASE_OFFSET = 24
/* 组件实现：相邻消息的偏移步长（按消息高度估值） */
const MESSAGE_OFFSET_STEP = 56

/* 组件实现：活跃消息实例列表（每项持有偏移 ref，用于重排） */
const instances: Array<{ offset: Ref<number> }> = []

/* 交互处理逻辑：按活跃顺序重排所有消息偏移，避免重叠与空洞 */
function relayout() {
  instances.forEach((item, index) => {
    item.offset.value = MESSAGE_BASE_OFFSET + index * MESSAGE_OFFSET_STEP
  })
}

/* 交互处理逻辑：卸载消息实例并清理挂载节点 */
function cleanup(app: ReturnType<typeof createApp>, host: HTMLDivElement) {
  app.unmount()
  host.remove()
}

/* 组件实现：创建全局 Message 实例 */
function openMessage(options: MessageOptions) {
  /* SSR 守卫：无 document 环境不创建实例 */
  if (typeof document === 'undefined') return () => undefined
  const host = document.createElement('div')
  document.body.appendChild(host)
  const offset = ref(MESSAGE_BASE_OFFSET)
  const record = { offset }
  instances.push(record)
  relayout()
  const app = createApp({
    render: () =>
      h(Message, {
        message: options.message,
        type: options.type ?? 'info',
        duration: options.duration ?? 3000,
        showClose: options.showClose ?? false,
        offset: offset.value,
        customClass: options.customClass,
        highlightSize: options.highlightSize,
        highlightOffset: options.highlightOffset,
        highlightOpacity: options.highlightOpacity,
        onClose: () => close()
      })
  })
  let active = true
  /* 交互处理逻辑：关闭当前消息（幂等，重复调用不二次卸载） */
  const close = () => {
    if (!active) return
    active = false
    cleanup(app, host)
    const index = instances.indexOf(record)
    if (index >= 0) instances.splice(index, 1)
    relayout()
  }
  app.mount(host)
  return close
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
