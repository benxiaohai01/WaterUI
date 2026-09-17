<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'

defineOptions({ name: 'DocsCodeBlock' })

const props = defineProps<{
  code: string
  language?: string
}>()

const copied = ref(false)
const expanded = ref(false)

/* 复制状态回退定时器句柄，卸载时必须清理 */
let copyTimer: number | undefined

const fallbackCopy = (text: string) => {
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.style.position = 'fixed'
  textarea.style.top = '0'
  textarea.style.left = '0'
  textarea.style.opacity = '0'
  textarea.style.pointerEvents = 'none'
  document.body.appendChild(textarea)
  textarea.focus()
  textarea.select()
  const result = document.execCommand('copy')
  document.body.removeChild(textarea)
  return result
}

const copy = async () => {
  let copiedSuccessfully = false
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(props.code)
      copiedSuccessfully = true
    } else {
      copiedSuccessfully = fallbackCopy(props.code)
    }
  } catch {
    copiedSuccessfully = fallbackCopy(props.code)
  } finally {
    copied.value = copiedSuccessfully
    if (copiedSuccessfully) {
      window.clearTimeout(copyTimer)
      copyTimer = window.setTimeout(() => {
        copied.value = false
      }, 1500)
    }
  }
}

onBeforeUnmount(() => {
  window.clearTimeout(copyTimer)
})
</script>

<template>
  <div class="code-block">
    <div class="code-block__bar">
      <span>{{ language || 'vue' }}</span>
      <wt-space :size="8">
        <wt-button size="small" type="default" @click="copy">
          <template #icon>
            <wt-icon :name="copied ? 'check' : 'copy'" :size="14" />
          </template>
          <span aria-live="polite">{{ copied ? '已复制' : '复制代码' }}</span>
        </wt-button>
        <wt-button size="small" type="default" :aria-expanded="expanded" @click="expanded = !expanded">
          <template #icon>
            <wt-icon :name="expanded ? 'chevron-down' : 'code'" :size="14" />
          </template>
          {{ expanded ? '收起' : '展开' }}
        </wt-button>
      </wt-space>
    </div>
    <div class="code-block__body" :class="{ 'is-expanded': expanded }">
      <pre><code>{{ code }}</code></pre>
    </div>
  </div>
</template>

<style scoped lang="scss">
.code-block {
  overflow: hidden;
  border-radius: var(--wt-radius-md);
  background: color-mix(in srgb, var(--wt-surface) 72%, var(--wt-primary) 8%);
  color: var(--wt-text);
  box-shadow:
    inset 3px 4px 10px var(--wt-shadow-dark),
    inset -2px -2px 6px var(--wt-shadow-light),
    0 10px 26px color-mix(in srgb, var(--wt-primary) 14%, transparent);
}

.code-block__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 44px;
  padding: 8px 12px;
  border-bottom: 1px solid color-mix(in srgb, var(--wt-primary) 16%, transparent);
  color: var(--wt-text-secondary);
  font-size: 12px;
}

.code-block__body {
  position: relative;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.16s ease;
}

.code-block__body.is-expanded {
  max-height: none;
}

.code-block pre {
  margin: 0;
  padding: 16px;
  overflow: auto;
  background: transparent;
  color: var(--wt-text);
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', monospace;
  font-size: 13px;
  line-height: 1.6;
  white-space: pre;
}

@media (max-width: 560px) {
  .code-block__bar {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
