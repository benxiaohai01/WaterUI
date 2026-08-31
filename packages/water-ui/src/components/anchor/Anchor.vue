<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { AnchorProps } from './props'
import { provideAnchor } from './context'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtAnchor' })

/* 声明组件入参与默认值 */
const props = withDefaults(defineProps<AnchorProps>(), {
  modelValue: undefined,
  defaultActive: undefined,
  container: undefined,
  offset: 0,
  clickActive: true,
  customClass: ''
})

/* 声明组件事件 */
const emit = defineEmits<{
  'update:modelValue': [href: string]
  change: [href: string]
  click: [href: string]
}>()

/* 响应式状态：已注册锚点 */
const links = ref<string[]>([])

/* 响应式状态：当前激活锚点 */
const activeHref = ref<string>('')

/* 响应式状态：滚动容器 */
const scrollContainer = ref<HTMLElement | Window | null>(null)

/* 提供上下文 */
provideAnchor({
  get activeHref() {
    return activeHref.value
  },
  onClick: (href) => {
    emit('click', href)
    if (props.clickActive) setActive(href)
    scrollToHref(href)
  },
  register: (href) => {
    if (!links.value.includes(href)) links.value.push(href)
  },
  unregister: (href) => {
    const index = links.value.indexOf(href)
    if (index !== -1) links.value.splice(index, 1)
  }
})

/* 派生状态：容器类名 */
const classes = computed(() => ['wt-anchor', props.customClass])

/* 设置激活项 */
const setActive = (href: string) => {
  if (activeHref.value === href) return
  activeHref.value = href
  emit('update:modelValue', href)
  emit('change', href)
}

/* 解析滚动容器 */
const resolveContainer = (): HTMLElement | Window | null => {
  if (typeof props.container === 'function') return props.container()
  if (typeof props.container === 'string') {
    const el = document.querySelector(props.container)
    return el instanceof HTMLElement ? el : null
  }
  return props.container ?? window
}

/* 平滑滚动到目标 */
const scrollToHref = (href: string) => {
  const id = href.replace(/^#/, '')
  const target = document.getElementById(id)
  if (!target) return
  const container = scrollContainer.value ?? window
  if (container === window) {
    const top = target.getBoundingClientRect().top + window.scrollY - props.offset
    window.scrollTo({ top, behavior: 'smooth' })
  } else {
    const el = container as HTMLElement
    const top = target.getBoundingClientRect().top - el.getBoundingClientRect().top + el.scrollTop - props.offset
    el.scrollTo({ top, behavior: 'smooth' })
  }
}

/* 滚动监听：计算当前激活锚点 */
const handleScroll = () => {
  const container = scrollContainer.value
  if (!container) return
  const scrollTop = container === window ? window.scrollY : (container as HTMLElement).scrollTop
  const viewportHeight = container === window ? window.innerHeight : (container as HTMLElement).clientHeight

  let current = ''
  for (const href of links.value) {
    const id = href.replace(/^#/, '')
    const el = document.getElementById(id)
    if (!el) continue
    const rect = el.getBoundingClientRect()
    const containerRect = container === window ? { top: 0 } : (container as HTMLElement).getBoundingClientRect()
    const top = rect.top - containerRect.top + scrollTop - props.offset
    if (top <= scrollTop + viewportHeight * 0.3) {
      current = href
    }
  }
  if (current && current !== activeHref.value) setActive(current)
}

const bindScroll = () => {
  scrollContainer.value = resolveContainer()
  if (!scrollContainer.value) return
  scrollContainer.value.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
}

const unbindScroll = () => {
  if (!scrollContainer.value) return
  scrollContainer.value.removeEventListener('scroll', handleScroll)
  scrollContainer.value = null
}

onMounted(bindScroll)
onBeforeUnmount(unbindScroll)

/* 监听容器变化（函数形式容器可能切换） */
watch(() => props.container, () => {
  unbindScroll()
  bindScroll()
})

/* 初始化激活值 */
watch(
  links,
  () => {
    if (!activeHref.value && links.value.length > 0 && props.defaultActive) {
      setActive(props.defaultActive)
    }
  },
  { immediate: true }
)
</script>

<template>
  <nav :class="classes" aria-label="锚点导航">
    <ul class="wt-anchor__list">
      <slot />
    </ul>
  </nav>
</template>

<style scoped lang="scss">
.wt-anchor {
  /* 内边距 */
  padding: 8px 10px;
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: var(--wt-radius-md);
  /* 背景 */
  background: linear-gradient(
    145deg,
    color-mix(in srgb, var(--wt-surface) 88%, transparent),
    color-mix(in srgb, var(--wt-bg) 90%, var(--wt-surface))
  );
  /* 水滴内外部阴影层次 */
  box-shadow:
    inset 2px 3px 8px rgba(0, 0, 0, 0.06),
    inset -2px -2px 5px var(--wt-shadow-light),
    2px 4px 12px rgba(0, 0, 0, 0.07);
}

.wt-anchor__list {
  /* 外边距 */
  margin: 0;
  /* 内边距 */
  padding: 0;
  /* 列表样式 */
  list-style: none;
}
</style>
