<script setup lang="ts">
import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue'
import type { MenuProps } from './props'
import { provideMenu, type SubMenuRegistration } from './context'
import { useUid } from '../../utils/uid'
import { useHighlightStyle } from '../../utils/highlight'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtMenu' })

/* 声明组件入参与默认值 */
const props = withDefaults(defineProps<MenuProps>(), {
  modelValue: undefined,
  defaultActive: undefined,
  mode: 'vertical',
  theme: 'light',
  collapse: false,
  uniqueOpened: false,
  router: false,
  customClass: ''
})

/* 声明组件事件 */
const emit = defineEmits<{
  'update:modelValue': [index: string]
  select: [index: string]
  'submenu-change': [index: string, opened: boolean]
}>()

const uid = useUid('wt-menu')

/* 组件级高光参数（优先级高于全局配置） */
const highlightStyle = useHighlightStyle(props)

/* 响应式状态：已注册的子菜单 */
const subMenus = reactive<SubMenuRegistration[]>([])

/* 响应式状态：展开的子菜单集合 */
const opened = reactive<string[]>([])

/* 响应式状态：内部激活标识（非受控兜底，默认取 defaultActive） */
const innerActive = ref<string>(props.defaultActive ?? '')

/* 派生状态：当前激活标识（外部传入 modelValue 时以外部为准） */
const activeIndex = computed<string>(() => {
  if (props.modelValue !== undefined) return props.modelValue
  return innerActive.value
})

/* 提供上下文 */
provideMenu({
  get mode() {
    return props.mode
  },
  get theme() {
    return props.theme
  },
  get collapse() {
    return props.collapse
  },
  get uniqueOpened() {
    return props.uniqueOpened
  },
  get activeIndex() {
    return activeIndex.value
  },
  get opened() {
    return opened
  },
  register: (subMenu) => {
    if (!subMenus.some((item) => item.index === subMenu.index)) subMenus.push(subMenu)
  },
  unregister: (index) => {
    const itemIndex = subMenus.findIndex((item) => item.index === index)
    if (itemIndex !== -1) subMenus.splice(itemIndex, 1)
    const openIndex = opened.indexOf(index)
    if (openIndex !== -1) opened.splice(openIndex, 1)
  },
  select: (index) => {
    /* 非受控场景：先更新内部状态，保证点击后高亮即时生效 */
    if (props.modelValue === undefined) innerActive.value = index
    /* 激活项变化才派发双向绑定；重复点击当前项仍派发 select */
    if (index !== activeIndex.value) emit('update:modelValue', index)
    emit('select', index)
  },
  toggleOpen: (index) => {
    const isOpen = opened.includes(index)
    if (isOpen) {
      opened.splice(opened.indexOf(index), 1)
    } else {
      if (props.uniqueOpened) opened.splice(0)
      opened.push(index)
    }
    emit('submenu-change', index, !isOpen)
  },
  isOpen: (index) => opened.includes(index)
})

/* 派生状态：容器类名 */
const classes = computed(() => [
  'wt-menu',
  `wt-menu--${props.mode}`,
  `wt-menu--${props.theme}`,
  { 'is-collapsed': props.collapse },
  props.customClass
])

watch(
  () => props.collapse,
  (collapse) => {
    if (collapse) opened.splice(0)
  }
)

onBeforeUnmount(() => {
  subMenus.splice(0)
  opened.splice(0)
})
</script>

<template>
  <ul :class="classes" :style="highlightStyle" role="menu" :aria-label="uid">
    <slot />
  </ul>
</template>

<style scoped lang="scss">
.wt-menu {
  /* 高光尺寸（随全局基准等比缩放，6px / 12px）：声明在根元素，便于组件 props 覆盖 */
  --wt-highlight-size: calc(var(--wt-highlight-size-base) * 0.5);
  /* 次高光尺寸（随全局基准等比缩放，3px / 12px） */
  --wt-highlight-small-size: calc(var(--wt-highlight-size-base) * 0.25);
  /* 高光内边距（随全局偏移等比缩放，3px / 8px） */
  --wt-highlight-inset: calc(var(--wt-highlight-offset) * 0.375);
  /* 主高光定位：右上角 */
  --wt-highlight-top: var(--wt-highlight-inset);
  --wt-highlight-right: var(--wt-highlight-inset);
  /* 次高光定位：右下角，避让菜单文字 */
  --wt-highlight-small-top: calc(100% - var(--wt-highlight-small-size) - var(--wt-highlight-inset));
  --wt-highlight-small-right: var(--wt-highlight-inset);
  /* 外边距 */
  margin: 0;
  /* 内边距 */
  padding: 6px;
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: var(--wt-radius-md);
  /* 背景 */
  background: linear-gradient(
    145deg,
    color-mix(in srgb, var(--wt-surface) 92%, transparent),
    color-mix(in srgb, var(--wt-bg) 88%, var(--wt-surface))
  );
  /* 水滴内外部阴影层次 */
  box-shadow:
    inset 2px 3px 8px rgba(0, 0, 0, 0.07),
    inset -2px -2px 5px var(--wt-shadow-light),
    3px 5px 14px rgba(0, 0, 0, 0.08);
  /* 盒模型显示方式 */
  display: flex;
  /* 排列方向 */
  flex-direction: column;
  /* 元素间距 */
  gap: 2px;
  /* 列表样式 */
  list-style: none;
}

.wt-menu--horizontal {
  /* 排列方向 */
  flex-direction: row;
  /* 交叉轴对齐方式 */
  align-items: center;
}

.wt-menu--dark {
  /* 背景 */
  background: linear-gradient(
    145deg,
    color-mix(in srgb, var(--wt-bg) 96%, #000 20%),
    #00000033
  );
  /* 水滴内外部阴影层次 */
  box-shadow:
    inset 2px 3px 8px rgba(255, 255, 255, 0.06),
    inset -2px -2px 5px rgba(0, 0, 0, 0.35),
    3px 5px 14px rgba(0, 0, 0, 0.3);
}

.wt-menu.is-collapsed {
  /* 宽度 */
  width: 56px;
}

/* 水平模式子菜单面板：悬浮弹出 */
.wt-menu--horizontal :deep(.wt-sub-menu__panel) {
  /* 定位方式 */
  position: absolute;
  /* 顶部偏移 */
  top: 100%;
  /* 左侧偏移 */
  left: 0;
  /* 层叠层级 */
  z-index: 20;
  /* 最小宽度 */
  min-width: 160px;
  /* 背景 */
  background: color-mix(in srgb, var(--wt-surface) 96%, transparent);
  /* 水滴内外部阴影层次 */
  box-shadow:
    inset 2px 3px 8px rgba(0, 0, 0, 0.07),
    inset -2px -2px 5px var(--wt-shadow-light),
    3px 6px 16px rgba(0, 0, 0, 0.14);
}
</style>
