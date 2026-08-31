<script setup lang="ts">
import { computed, onBeforeUnmount, reactive, watch } from 'vue'
import type { MenuProps } from './props'
import { provideMenu, type SubMenuRegistration } from './context'
import { useUid } from '../../utils/uid'

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

/* 响应式状态：已注册的子菜单 */
const subMenus = reactive<SubMenuRegistration[]>([])

/* 响应式状态：展开的子菜单集合 */
const opened = reactive<string[]>([])

/* 派生状态：当前激活标识 */
const activeIndex = computed<string>(() => {
  if (props.modelValue !== undefined) return props.modelValue
  if (props.defaultActive !== undefined) return props.defaultActive
  return ''
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
    if (index === activeIndex.value) return
    emit('update:modelValue', index)
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
  <ul :class="classes" role="menu" :aria-label="uid">
    <slot />
  </ul>
</template>

<style scoped lang="scss">
.wt-menu {
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
.wt-menu--horizontal .wt-sub-menu__panel {
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
