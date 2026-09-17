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
  targetOffset: 0,
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

/* 响应式状态：最近一次点击定位的锚点（目标仍在视口内时保持高亮，避免与地址栏 hash 不一致） */
const clickedHref = ref('')

/* 提供上下文 */
provideAnchor({
  get activeHref() {
    return activeHref.value
  },
  onClick: (href) => {
    emit('click', href)
    clickedHref.value = href
    if (props.clickActive) setActive(href)
    syncHash(href)
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

/* 规范化锚点 href（去掉前缀 #） */
const normalizeHref = (href: string) => href.replace(/^#/, '')

/* 解析锚点对应的目标元素 */
const resolveTarget = (href: string): HTMLElement | null => {
  const id = normalizeHref(href)
  return id ? document.getElementById(id) : null
}

/* 目标定位偏移：滚动偏移量 + 目标额外偏移（可预留固定头部高度） */
const targetOffset = computed(() => props.offset + props.targetOffset)

/* 设置激活项 */
const setActive = (href: string) => {
  if (activeHref.value === href) return
  activeHref.value = href
  emit('update:modelValue', href)
  emit('change', href)
}

/* 同步地址栏 hash（replaceState 不新增历史记录，保证 hash 与高亮一致） */
const syncHash = (href: string) => {
  const hash = `#${normalizeHref(href)}`
  if (window.location.hash === hash) return
  history.replaceState(null, '', hash)
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

/* 判断滚动容器是否为窗口 */
const isWindowContainer = (container: HTMLElement | Window): container is Window => container === window

/* 获取容器滚动位置 */
const getScrollTop = (container: HTMLElement | Window) =>
  isWindowContainer(container) ? window.scrollY || document.documentElement.scrollTop : container.scrollTop

/* 获取容器可视高度 */
const getViewportHeight = (container: HTMLElement | Window) =>
  isWindowContainer(container) ? window.innerHeight : container.clientHeight

/* 计算目标元素相对滚动内容区顶部的位置（基于 getBoundingClientRect，兼容滚动容器与固定头部） */
const getTargetTop = (target: HTMLElement, container: HTMLElement | Window, scrollTop: number) => {
  const rect = target.getBoundingClientRect()
  if (isWindowContainer(container)) return rect.top + scrollTop
  const containerRect = container.getBoundingClientRect()
  /* 扣除容器上边框，保证目标位置与 scrollTop 处于同一参考系 */
  return rect.top - containerRect.top - container.clientTop + scrollTop
}

/* 平滑滚动到目标 */
const scrollToHref = (href: string) => {
  const target = resolveTarget(href)
  if (!target) return
  const container = scrollContainer.value ?? window
  const top = getTargetTop(target, container, getScrollTop(container)) - targetOffset.value
  if (isWindowContainer(container)) {
    window.scrollTo({ top, behavior: 'smooth' })
  } else {
    container.scrollTo({ top, behavior: 'smooth' })
  }
}

/* 滚动监听：计算当前激活锚点 */
const handleScroll = () => {
  const container = scrollContainer.value
  if (!container) return
  const scrollTop = getScrollTop(container)
  const viewportHeight = getViewportHeight(container)
  /* 判定线：容器可视区顶部 30% 处 */
  const activation = scrollTop + viewportHeight * 0.3

  let current = ''
  for (const href of links.value) {
    const el = resolveTarget(href)
    if (!el) continue
    if (getTargetTop(el, container, scrollTop) - props.offset <= activation) current = href
  }

  /* 点击定位后目标仍在视口内时保持点击项高亮（滚动被夹取时不会跳回上一项），离开视口后恢复常规侦测 */
  const pendingTarget = clickedHref.value ? resolveTarget(clickedHref.value) : null
  if (clickedHref.value && pendingTarget) {
    const rect = pendingTarget.getBoundingClientRect()
    const containerTop = isWindowContainer(container) ? 0 : container.getBoundingClientRect().top
    const containerBottom = isWindowContainer(container)
      ? window.innerHeight
      : container.getBoundingClientRect().bottom
    const inView = rect.bottom > containerTop + props.offset && rect.top < containerBottom
    if (!inView) {
      clickedHref.value = ''
    } else if (links.value.indexOf(current) < links.value.indexOf(clickedHref.value)) {
      current = clickedHref.value
    }
  }

  if (!current) return
  if (current !== activeHref.value) {
    setActive(current)
    /* 滚动触发的激活项变化同样写回地址栏，保证两者一致 */
    syncHash(current)
  }
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

onMounted(() => {
  bindScroll()
  /* 初始 hash 同步：地址栏已带锚点时滚动到对应位置并高亮该链接 */
  const initial = normalizeHref(window.location.hash)
  if (!initial || !links.value.includes(initial)) return
  clickedHref.value = initial
  setActive(initial)
  scrollToHref(initial)
})
onBeforeUnmount(unbindScroll)

/* 监听容器变化（函数形式容器可能切换） */
watch(() => props.container, () => {
  unbindScroll()
  bindScroll()
})

/* 初始化激活值：外部 modelValue 优先（初值与后续外部修改均以外部为准） */
watch(
  () => props.modelValue,
  (value) => {
    if (value) activeHref.value = value
  },
  { immediate: true }
)

/* 初始化激活值：锚点注册完成后回落到 defaultActive */
watch(
  () => links.value.slice(),
  () => {
    if (!activeHref.value && links.value.length > 0 && props.defaultActive) {
      setActive(props.defaultActive)
    }
  },
  { immediate: true, flush: 'post' }
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
