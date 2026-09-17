<script setup lang="ts">
import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue'
import type { TabsProps } from './props'
import { provideTabs, type TabPaneRegistration } from './context'
import { useUid } from '../../utils/uid'
import { useHighlightStyle } from '../../utils/highlight'

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

/* 组件级高光参数（优先级高于全局配置） */
const highlightStyle = useHighlightStyle(props)

/* 响应式状态：已注册的选项卡面板 */
const panes = reactive<TabPaneRegistration[]>([])

/* 响应式状态：非受控模式下的内部激活标识 */
const innerActive = ref<string | number | undefined>(props.defaultActive)

/* 派生状态：当前激活标识（受控优先，其次内部状态，最后首个面板） */
const activeName = computed<string | number>(() => {
  if (props.modelValue !== undefined) return props.modelValue
  if (innerActive.value !== undefined) return innerActive.value
  return panes[0]?.name ?? ''
})

/* 交互处理逻辑：选中选项卡 */
const selectPane = (name: string | number) => {
  const pane = panes.find((p) => p.name === name)
  if (!pane || pane.disabled || name === activeName.value) return
  innerActive.value = name
  emit('update:modelValue', name)
  emit('change', name)
}

/* 交互处理逻辑：关闭选项卡 */
const closePane = (name: string | number) => {
  emit('close', name)
}

/* 交互处理逻辑：新增选项卡 */
const addPane = () => {
  emit('add')
}

/* 提供上下文 */
provideTabs({
  id: uid,
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
  update: (name, patch) => {
    const pane = panes.find((p) => p.name === name)
    if (pane) Object.assign(pane, patch)
  },
  select: selectPane,
  close: closePane,
  add: addPane
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
    nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % enabled.length
  } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
    nextIndex = currentIndex < 0 ? enabled.length - 1 : (currentIndex - 1 + enabled.length) % enabled.length
  } else if (event.key === 'Home') {
    nextIndex = 0
  } else if (event.key === 'End') {
    nextIndex = enabled.length - 1
  }
  event.preventDefault()
  const next = enabled[nextIndex]
  if (next && next.name !== activeName.value) {
    selectPane(next.name)
  }
}

watch(
  () => panes.length,
  () => {
    /* 当前激活项被移除时自动切换到第一项（非受控下同步内部状态） */
    if (!panes.length) return
    if (panes.some((pane) => pane.name === activeName.value)) return
    const nextName = panes[0].name
    innerActive.value = nextName
    if (props.modelValue !== undefined) {
      emit('update:modelValue', nextName)
      emit('change', nextName)
    }
  }
)

onBeforeUnmount(() => {
  panes.splice(0)
})
</script>

<template>
  <div :class="classes" :style="highlightStyle">
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
          :aria-controls="`${uid}-panel-${String(pane.name)}`"
          :aria-disabled="pane.disabled"
          :tabindex="pane.name === activeName ? 0 : -1"
          @click="selectPane(pane.name)"
        >
          <slot :name="`label-${String(pane.name)}`" :pane="pane">{{ pane.label }}</slot>
          <span
            v-if="editable || closable"
            class="wt-tabs__close"
            role="button"
            aria-label="关闭"
            @click.stop="closePane(pane.name)"
          >
            ×
          </span>
        </button>

        <button
          v-if="editable || addable"
          type="button"
          class="wt-tabs__add"
          aria-label="新增选项卡"
          @click="addPane"
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
@use '@water-ui/theme/src/mixins/index.scss' as wt;

.wt-tabs {
  /* 高光尺寸（随全局基准等比缩放，6px / 12px）：声明在根元素，便于组件 props 覆盖 */
  --wt-highlight-size: calc(var(--wt-highlight-size-base) * 0.5);
  /* 次高光尺寸（随全局基准等比缩放，3px / 12px） */
  --wt-highlight-small-size: calc(var(--wt-highlight-size-base) * 0.25);
  /* 高光内边距（随全局偏移等比缩放，3px / 8px） */
  --wt-highlight-inset: calc(var(--wt-highlight-offset) * 0.375);
  /* 主高光定位：右上角 */
  --wt-highlight-top: var(--wt-highlight-inset);
  --wt-highlight-right: var(--wt-highlight-inset);
  /* 次高光定位：右下角，避让标签文字 */
  --wt-highlight-small-top: calc(100% - var(--wt-highlight-small-size) - var(--wt-highlight-inset));
  --wt-highlight-small-right: var(--wt-highlight-inset);
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
    background var(--wt-motion-fast) ease,
    color var(--wt-motion-fast) ease,
    transform var(--wt-motion-fast) ease;
}

.wt-tabs__tab:hover:not(.is-disabled) {
  /* 文本颜色 */
  color: var(--wt-text);
  /* 背景 */
  background: color-mix(in srgb, var(--wt-primary) 8%, transparent);
}

.wt-tabs__tab.is-active {
  /* 水滴高光：定位方式 + 独立层叠上下文 + 主/次高光伪元素（层叠层级 2） */
  @include wt.wt-liquid-highlights(2);
  /* 溢出裁剪方式（高光收束在标签内） */
  overflow: hidden;
  /* 液体形变动画（含 will-change: border-radius） */
  @include wt.wt-liquid-animation(wt-liquid-flow, var(--wt-motion-normal), border-radius);
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
    background var(--wt-motion-fast) ease,
    color var(--wt-motion-fast) ease;
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
