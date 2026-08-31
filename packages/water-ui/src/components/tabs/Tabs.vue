<script setup lang="ts">
import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue'
import type { TabsProps } from './props'
import { provideTabs, type TabPaneRegistration } from './context'
import { useUid } from '../../utils/uid'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtTabs' })

/* 声明组件入参与默认值 */
const props = withDefaults(defineProps<TabsProps>(), {
  modelValue: undefined,
  defaultActive: undefined,
  type: 'text',
  position: 'top',
  closable: false,
  addable: false,
  editable: false,
  customClass: ''
})

/* 声明组件事件 */
const emit = defineEmits<{
  'update:modelValue': [name: string | number]
  change: [name: string | number]
  close: [name: string | number]
  add: []
}>()

const uid = useUid('wt-tabs')

/* 响应式状态：已注册的选项卡面板 */
const panes = reactive<TabPaneRegistration[]>([])

/* 派生状态：当前激活标识 */
const activeName = computed<string | number>(() => {
  if (props.modelValue !== undefined) return props.modelValue
  if (props.defaultActive !== undefined) return props.defaultActive
  return panes[0]?.name ?? ''
})

/* 提供上下文 */
provideTabs({
  get type() {
    return props.type
  },
  get activeName() {
    return activeName.value
  },
  get closable() {
    return props.closable
  },
  get addable() {
    return props.addable
  },
  get editable() {
    return props.editable
  },
  get panes() {
    return panes
  },
  register: (pane) => {
    if (!panes.some((p) => p.name === pane.name)) panes.push(pane)
  },
  unregister: (name) => {
    const index = panes.findIndex((pane) => pane.name === name)
    if (index !== -1) panes.splice(index, 1)
  },
  select: (name) => {
    const pane = panes.find((p) => p.name === name)
    if (!pane || pane.disabled || name === activeName.value) return
    emit('update:modelValue', name)
    emit('change', name)
  },
  close: (name) => {
    emit('close', name)
  },
  add: () => {
    emit('add')
  }
})

/* 派生状态：导航类名 */
const navClasses = computed(() => [
  'wt-tabs__nav',
  `wt-tabs__nav--${props.type}`,
  `is-${props.position}`
])

/* 派生状态：容器类名 */
const classes = computed(() => [
  'wt-tabs',
  `wt-tabs--${props.position}`,
  props.customClass
])

/* 键盘导航：左右方向键切换 */
const navRef = ref<HTMLElement>()

const handleKeydown = (event: KeyboardEvent) => {
  if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) {
    return
  }
  const enabled = panes.filter((pane) => !pane.disabled)
  if (!enabled.length) return
  const currentIndex = enabled.findIndex((pane) => pane.name === activeName.value)
  let nextIndex = currentIndex
  if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
    nextIndex = (currentIndex + 1) % enabled.length
  } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
    nextIndex = (currentIndex - 1 + enabled.length) % enabled.length
  } else if (event.key === 'Home') {
    nextIndex = 0
  } else if (event.key === 'End') {
    nextIndex = enabled.length - 1
  }
  event.preventDefault()
  const next = enabled[nextIndex]
  if (next && next.name !== activeName.value) {
    emit('update:modelValue', next.name)
    emit('change', next.name)
  }
}

watch(
  () => panes.length,
  () => {
    /* 若当前激活项被移除且仍有剩余面板，自动切换到第一项 */
    if (
      props.modelValue !== undefined &&
      !panes.some((pane) => pane.name === props.modelValue) &&
      panes.length > 0
    ) {
      emit('update:modelValue', panes[0].name)
      emit('change', panes[0].name)
    }
  }
)

/* 交互处理逻辑：选中选项卡 */
const select = (name: string | number) => {
  const pane = panes.find((p) => p.name === name)
  if (!pane || pane.disabled || name === activeName.value) return
  emit('update:modelValue', name)
  emit('change', name)
}

/* 交互处理逻辑：关闭选项卡 */
const close = (name: string | number) => {
  emit('close', name)
}

/* 交互处理逻辑：新增选项卡 */
const add = () => {
  emit('add')
}

onBeforeUnmount(() => {
  panes.splice(0)
})
</script>

<template>
  <div :class="classes">
    <div class="wt-tabs__header" role="tablist" :aria-orientation="position === 'top' || position === 'bottom' ? 'horizontal' : 'vertical'">
      <div ref="navRef" :class="navClasses" @keydown="handleKeydown">
        <button
          v-for="pane in panes"
          :id="`${uid}-tab-${String(pane.name)}`"
          :key="String(pane.name)"
          type="button"
          class="wt-tabs__tab"
          :class="{
            'is-active': pane.name === activeName,
            'is-disabled': pane.disabled
          }"
          role="tab"
          :aria-selected="pane.name === activeName"
          :aria-disabled="pane.disabled"
          :tabindex="pane.name === activeName ? 0 : -1"
          @click="select(pane.name)"
        >
          <slot :name="`label-${String(pane.name)}`" :pane="pane">{{ pane.label }}</slot>
          <span
            v-if="editable || closable"
            class="wt-tabs__close"
            role="button"
            aria-label="关闭"
            @click.stop="close(pane.name)"
          >
            ×
          </span>
        </button>

        <button
          v-if="editable || addable"
          type="button"
          class="wt-tabs__add"
          aria-label="新增选项卡"
          @click="add"
        >
          +
        </button>
      </div>
    </div>

    <div class="wt-tabs__content">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
.wt-tabs {
  /* 盒模型显示方式 */
  display: flex;
  /* 排列方向 */
  flex-direction: column;
  /* 元素间距 */
  gap: 12px;
}

.wt-tabs--top .wt-tabs__header {
  /* 排列方向 */
  order: 0;
}

.wt-tabs--bottom .wt-tabs__header {
  /* 排列方向 */
  order: 1;
}

.wt-tabs--left,
.wt-tabs--right {
  /* 排列方向 */
  flex-direction: row;
}

.wt-tabs--left .wt-tabs__header {
  /* 排列方向 */
  order: 0;
}

.wt-tabs--right .wt-tabs__header {
  /* 排列方向 */
  order: 1;
}

.wt-tabs__header {
  /* 盒模型显示方式 */
  display: flex;
}

.wt-tabs--left .wt-tabs__header,
.wt-tabs--right .wt-tabs__header {
  /* 排列方向 */
  flex-direction: column;
}

.wt-tabs__nav {
  /* 盒模型显示方式 */
  display: flex;
  /* 交叉轴对齐方式 */
  align-items: center;
  /* 元素间距 */
  gap: 4px;
  /* 内边距 */
  padding: 4px;
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: var(--wt-radius-md);
  /* 背景 */
  background: color-mix(in srgb, var(--wt-surface) 60%, transparent);
  /* 水滴内外部阴影层次 */
  box-shadow:
    inset 2px 3px 6px rgba(0, 0, 0, 0.06),
    inset -2px -2px 5px var(--wt-shadow-light);
}

.wt-tabs--left .wt-tabs__nav,
.wt-tabs--right .wt-tabs__nav {
  /* 排列方向 */
  flex-direction: column;
  /* 交叉轴对齐方式 */
  align-items: stretch;
}

.wt-tabs__tab {
  /* 定位方式 */
  position: relative;
  /* 盒模型显示方式 */
  display: inline-flex;
  /* 交叉轴对齐方式 */
  align-items: center;
  /* 元素间距 */
  gap: 6px;
  /* 内边距 */
  padding: 8px 14px;
  /* 边框 */
  border: 0;
  /* 背景 */
  background: transparent;
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: var(--wt-radius-sm);
  /* 文本颜色 */
  color: var(--wt-text-secondary);
  /* 字号 */
  font-size: 14px;
  /* 字体族 */
  font-family: inherit;
  /* 鼠标指针样式 */
  cursor: pointer;
  /* 过渡动画 */
  transition:
    background 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;
}

.wt-tabs__tab:hover:not(.is-disabled) {
  /* 文本颜色 */
  color: var(--wt-text);
  /* 背景 */
  background: color-mix(in srgb, var(--wt-primary) 8%, transparent);
}

.wt-tabs__tab.is-active {
  /* 背景 */
  background: linear-gradient(
    145deg,
    rgba(0, 0, 0, var(--wt-shadow-dark-alpha)),
    rgba(0, 0, 0, var(--wt-shadow-dark-alpha-strong))
  );
  /* 水滴内外部阴影层次 */
  box-shadow:
    inset 2px 3px 6px rgba(0, 0, 0, 0.1),
    inset -2px -2px 5px var(--wt-shadow-light),
    2px 3px 8px rgba(0, 0, 0, 0.07);
  /* 文本颜色 */
  color: var(--wt-primary);
  /* 字重 */
  font-weight: 600;
}

.wt-tabs__tab.is-disabled {
  /* 鼠标指针样式 */
  cursor: not-allowed;
  /* 透明度 */
  opacity: 0.5;
}

.wt-tabs__tab:focus-visible {
  /* 焦点轮廓 */
  outline: 2px solid var(--wt-primary);
  /* 焦点轮廓偏移 */
  outline-offset: 2px;
}

.wt-tabs__close {
  /* 盒模型显示方式 */
  display: inline-flex;
  /* 交叉轴对齐方式 */
  align-items: center;
  /* 主轴内容分配方式 */
  justify-content: center;
  /* 宽度 */
  width: 16px;
  /* 高度 */
  height: 16px;
  /* 圆角 */
  border-radius: 50%;
  /* 字号 */
  font-size: 13px;
  /* 行高 */
  line-height: 1;
  /* 鼠标指针样式 */
  cursor: pointer;
}

.wt-tabs__close:hover {
  /* 背景 */
  background: color-mix(in srgb, var(--wt-text-placeholder) 20%, transparent);
}

.wt-tabs__add {
  /* 盒模型显示方式 */
  display: inline-flex;
  /* 交叉轴对齐方式 */
  align-items: center;
  /* 主轴内容分配方式 */
  justify-content: center;
  /* 宽度 */
  width: 28px;
  /* 高度 */
  height: 28px;
  /* 边框 */
  border: 0;
  /* 圆角 */
  border-radius: var(--wt-radius-sm);
  /* 背景 */
  background: transparent;
  /* 文本颜色 */
  color: var(--wt-text-secondary);
  /* 字号 */
  font-size: 16px;
  /* 鼠标指针样式 */
  cursor: pointer;
  /* 过渡动画 */
  transition:
    background 0.2s ease,
    color 0.2s ease;
}

.wt-tabs__add:hover {
  /* 背景 */
  background: color-mix(in srgb, var(--wt-primary) 12%, transparent);
  /* 文本颜色 */
  color: var(--wt-primary);
}

.wt-tabs__content {
  /* 弹性布局中的伸缩比例 */
  flex: 1;
  /* 最小宽度 */
  min-width: 0;
}
</style>
