<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import type { CascaderOption, CascaderProps } from './props'
import { resolveSize } from '../config-provider/context'
import { useHighlightStyle } from '../../utils/highlight'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtCascader' })

/* 声明组件入参与默认值 */
const props = withDefaults(defineProps<CascaderProps>(), {
  modelValue: () => [],
  options: () => [],
  placeholder: '请选择',
  disabled: false,
  clearable: false,
  customClass: ''
})

/* 声明组件事件 */
const emit = defineEmits<{
  'update:modelValue': [value: Array<string | number>]
  change: [value: Array<string | number>]
  clear: []
}>()

/* 响应式状态 */
const open = ref(false)
const rootRef = ref<HTMLDivElement>()
const activeIndex = ref(-1)
/* 展开的面板路径：仅存 value，保证 options 异步更新后仍能重新定位 */
const breadcrumb = ref<Array<string | number>>([])

/* 解析组件尺寸配置 */
const size = resolveSize(() => props.size)

/* 组件级高光参数（优先级高于全局配置） */
const highlightStyle = useHighlightStyle(props)

const findPath = (

  options: CascaderOption[],
  values: Array<string | number>,
  trail: CascaderOption[] = []
): CascaderOption[] => {
  for (const option of options) {
    const nextTrail = [...trail, option]
    if (option.value === values[0]) {
      if (values.length === 1 || !option.children) return nextTrail
      return findPath(option.children, values.slice(1), nextTrail)
    }
  }
  return trail
}

/* 派生状态（计算属性）：当前面板选项（由展开路径派生，跟随 options 更新） */
const viewOptions = computed<CascaderOption[]>(() => {
  let list = props.options
  for (const value of breadcrumb.value) {
    const matched = list.find((option) => option.value === value)
    if (!matched?.children?.length) return []
    list = matched.children
  }
  return list
})

/* 派生状态（计算属性）：面包屑路径选项 */
const breadcrumbOptions = computed<CascaderOption[]>(() => {
  const list: CascaderOption[] = []
  let level = props.options
  for (const value of breadcrumb.value) {
    const matched = level.find((option) => option.value === value)
    if (!matched) break
    list.push(matched)
    level = matched.children || []
  }
  return list
})

/* 派生状态（计算属性） */
const selectedPath = computed(() => findPath(props.options, props.modelValue))

/* 派生状态（计算属性） */
const display = computed(() => {
  if (selectedPath.value.length) return selectedPath.value.map((item) => item.label).join(' / ')
  return breadcrumbOptions.value.map((item) => item.label).join(' / ')
})

/* 派生状态（计算属性） */
const classes = computed(() => [
  'wt-cascader',
  `wt-cascader--${size.value}`,
  {
    'is-disabled': props.disabled,
    'is-open': open.value
  },
  props.customClass
])

/* 交互处理逻辑：按已选值逐级定位并展开到其父级面板 */
const syncBreadcrumb = () => {
  const path: Array<string | number> = []
  let level = props.options
  for (const value of props.modelValue) {
    const matched = level.find((option) => option.value === value)
    if (!matched?.children?.length) break
    path.push(matched.value)
    level = matched.children
  }
  breadcrumb.value = path
  activeIndex.value = -1
}

/* 交互处理逻辑 */
const toggle = () => {
  if (props.disabled) return
  open.value = !open.value
  if (open.value) {
    syncBreadcrumb()
  }
}

/* 交互处理逻辑 */
const enter = (option: CascaderOption) => {
  if (option.disabled) return
  if (option.children?.length) {
    breadcrumb.value = [...breadcrumb.value, option.value]
    activeIndex.value = -1
    return
  }
  const next = [...breadcrumb.value, option.value]
  emit('update:modelValue', next)
  emit('change', next)
  open.value = false
  activeIndex.value = -1
}

/* 交互处理逻辑 */
const back = () => {
  if (!breadcrumb.value.length) {
    open.value = false
    return
  }
  breadcrumb.value = breadcrumb.value.slice(0, -1)
  activeIndex.value = -1
}

/* 交互处理逻辑：清空 */
const clear = () => {
  emit('update:modelValue', [])
  emit('clear')
  breadcrumb.value = []
  activeIndex.value = -1
}

/* 交互处理逻辑：键盘移动高亮项（循环） */
const moveActive = (delta: number) => {
  const total = viewOptions.value.length
  if (!total) {
    activeIndex.value = -1
    return
  }
  const next = activeIndex.value + delta
  activeIndex.value = next < 0 ? total - 1 : next >= total ? 0 : next
}

/* 交互处理逻辑：最小键盘可达性（上下移动、回车进入/选中、Esc 关闭/返回上一级） */
const handleKeydown = (event: KeyboardEvent) => {
  if (props.disabled) return
  if (event.key === 'Escape') {
    event.preventDefault()
    if (open.value && breadcrumb.value.length) {
      back()
      return
    }
    open.value = false
    return
  }
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()
    if (!open.value) {
      toggle()
      return
    }
    moveActive(event.key === 'ArrowDown' ? 1 : -1)
    return
  }
  if (event.key === 'Enter') {
    if (open.value && activeIndex.value >= 0) {
      const option = viewOptions.value[activeIndex.value]
      if (option) {
        event.preventDefault()
        enter(option)
        return
      }
    }
    event.preventDefault()
    toggle()
  }
}

/* 交互处理逻辑 */
const handleOutside = (event: PointerEvent) => {
  if (rootRef.value && !rootRef.value.contains(event.target as Node)) {
    open.value = false
    activeIndex.value = -1
  }
}

onMounted(() => document.addEventListener('pointerdown', handleOutside))
onBeforeUnmount(() => document.removeEventListener('pointerdown', handleOutside))
</script>

<template>
  <div ref="rootRef" :class="classes" :style="highlightStyle">
    <div
      class="wt-cascader__trigger"
      role="button"
      tabindex="0"
      aria-haspopup="listbox"
      :aria-expanded="open"
      @click="toggle"
      @keydown="handleKeydown"
    >
      <span class="wt-cascader__value" :class="{ 'is-placeholder': !display }">
        {{ display || placeholder }}
      </span>
      <button
        v-if="clearable && modelValue.length && !disabled"
        class="wt-cascader__clear"
        type="button"
        aria-label="清空"
        @click.stop="clear"
      >
        ×
      </button>
      <span class="wt-cascader__caret" aria-hidden="true" />
    </div>

    <div v-if="open" class="wt-cascader__dropdown">
      <div v-if="breadcrumbOptions.length" class="wt-cascader__breadcrumb">
        <button type="button" @click="back">上一级</button>
        <span v-for="item in breadcrumbOptions" :key="String(item.value)">{{ item.label }}</span>
      </div>
      <ul class="wt-cascader__list" role="listbox">
        <li v-if="!viewOptions.length" class="wt-cascader__empty">暂无选项</li>
        <li
          v-for="(option, index) in viewOptions"
          :key="String(option.value)"
          class="wt-cascader__option"
          :class="{ 'is-disabled': option.disabled, 'is-active': index === activeIndex }"
          role="option"
          tabindex="-1"
          :aria-selected="index === activeIndex"
          :aria-disabled="option.disabled"
          @click="enter(option)"
        >
          <span>{{ option.label }}</span>
          <span v-if="option.children?.length" class="wt-cascader__arrow" aria-hidden="true" />
        </li>
      </ul>
    </div>
  </div>
</template>
<style scoped lang="scss">
@use '@water-ui/theme/src/mixins/index.scss' as wt;

.wt-cascader {
  /* 高光尺寸（随全局基准等比缩放，11px / 12px） */
  --wt-highlight-size: calc(var(--wt-highlight-size-base) * 0.9167);
  /* 次高光尺寸（随全局基准等比缩放，6px / 12px） */
  --wt-highlight-small-size: calc(var(--wt-highlight-size-base) * 0.5);
  /* 高光内边距（随全局偏移等比缩放，6px / 8px） */
  --wt-highlight-inset: calc(var(--wt-highlight-offset) * 0.75);
  /* 水滴高光：定位方式 + 独立层叠上下文 + 主/次高光伪元素（层叠层级 1） */
  @include wt.wt-liquid-highlights(1);
  /* 层叠层级 */
  z-index: 1;
  /* 宽度 */
  width: 100%;
  /* 最小宽度 */
  min-width: 0;
}

.wt-cascader.is-open {
  /* 层叠层级 */
  z-index: 40;
}

.wt-cascader__trigger {
  /* 定位方式 */
  position: relative;
  /* 盒模型显示方式 */
  display: flex;
  /* 交叉轴对齐方式 */
  align-items: center;
  /* 元素间距 */
  gap: 8px;
  /* 最小高度 */
  min-height: 42px;
  /* 内边距 */
  padding: 0 16px;
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: var(--wt-radius-md);
  /* 背景 */
  background: linear-gradient(
    145deg,
    rgba(0, 0, 0, var(--wt-shadow-dark-alpha)),
    rgba(0, 0, 0, var(--wt-shadow-dark-alpha-strong))
  );
  /* 水滴内外部阴影层次 */
  box-shadow:
    inset 3px 4px 8px rgba(0, 0, 0, 0.15),
    inset -2px -2px 5px var(--wt-shadow-light),
    3px 4px 12px rgba(0, 0, 0, 0.1),
    0 1px 4px rgba(0, 0, 0, 0.06);
  /* 文本颜色 */
  color: var(--wt-text);
  /* 字体族 */
  font-family: inherit;
  /* 字号 */
  font-size: 15px;
  /* 鼠标指针样式 */
  cursor: pointer;
  /* 动画 */
  animation: wt-liquid-flow-subtle var(--wt-motion-slow) ease-in-out infinite;
}

.wt-cascader__value {
  /* 弹性布局中的伸缩比例 */
  flex: 1;
  /* 最小宽度 */
  min-width: 0;
  /* 溢出裁剪方式 */
  overflow: hidden;
  /* 文本溢出省略方式 */
  text-overflow: ellipsis;
  /* 空白与换行处理 */
  white-space: nowrap;
}

.wt-cascader__value.is-placeholder {
  /* 文本颜色 */
  color: var(--wt-text-placeholder);
}

.wt-cascader__clear {
  /* 边框 */
  border: 0;
  /* 背景 */
  background: transparent;
  /* 文本颜色 */
  color: var(--wt-text-placeholder);
  /* 字号 */
  font-size: 18px;
  /* 鼠标指针样式 */
  cursor: pointer;
  /* 层叠层级 */
  z-index: 2;
}

.wt-cascader__caret {
  /* 宽度 */
  width: 0;
  /* 高度 */
  height: 0;
  /* 左侧外边距 */
  margin-left: 2px;
  /* 左侧边框 */
  border-left: 5px solid transparent;
  /* 右侧边框 */
  border-right: 5px solid transparent;
  /* 顶部边框 */
  border-top: 6px solid var(--wt-text-secondary);
  /* 过渡动画 */
  transition: transform var(--wt-motion-fast) ease;
}

.wt-cascader.is-open .wt-cascader__caret {
  /* 形变 */
  transform: rotate(180deg);
}

.wt-cascader__dropdown {
  /* 定位方式 */
  position: absolute;
  /* 顶部偏移 */
  top: calc(100% + 6px);
  /* 左侧偏移 */
  left: 0;
  /* 层叠层级 */
  z-index: 30;
  /* 宽度 */
  width: 100%;
  /* 最大高度 */
  max-height: 240px;
  /* 溢出裁剪方式 */
  overflow: auto;
  /* 内边距 */
  padding: 6px;
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: var(--wt-radius-md);
  /* 背景 */
  background: color-mix(in srgb, var(--wt-surface) 94%, transparent);
  /* 水滴内外部阴影层次 */
  box-shadow:
    inset 2px 3px 8px rgba(0, 0, 0, 0.08),
    inset -2px -2px 5px var(--wt-shadow-light),
    3px 6px 16px rgba(0, 0, 0, 0.12);
}

.wt-cascader__breadcrumb {
  /* 盒模型显示方式 */
  display: flex;
  /* 交叉轴对齐方式 */
  align-items: center;
  /* 元素间距 */
  gap: 8px;
  /* 内边距 */
  padding: 6px 8px 10px;
  /* 文本颜色 */
  color: var(--wt-text-secondary);
  /* 字号 */
  font-size: 13px;
}

.wt-cascader__breadcrumb button {
  /* 边框 */
  border: 0;
  /* 背景 */
  background: transparent;
  /* 文本颜色 */
  color: var(--wt-primary);
  /* 字号 */
  font-size: 13px;
  /* 鼠标指针样式 */
  cursor: pointer;
}

.wt-cascader__list {
  /* 外边距 */
  margin: 0;
  /* 内边距 */
  padding: 0;
  /* 列表样式 */
  list-style: none;
}

.wt-cascader__option,
.wt-cascader__empty {
  /* 盒模型显示方式 */
  display: flex;
  /* 交叉轴对齐方式 */
  align-items: center;
  /* 主轴内容分配方式 */
  justify-content: space-between;
  /* 内边距 */
  padding: 9px 12px;
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: var(--wt-radius-sm);
  /* 文本颜色 */
  color: var(--wt-text);
  /* 字号 */
  font-size: 14px;
  /* 鼠标指针样式 */
  cursor: pointer;
}

.wt-cascader__option:hover,
.wt-cascader__option.is-active {
  /* 背景 */
  background: color-mix(in srgb, var(--wt-primary) 14%, transparent);
  /* 文本颜色 */
  color: var(--wt-primary);
}

.wt-cascader__option.is-disabled {
  /* 鼠标指针样式 */
  cursor: not-allowed;
  /* 透明度 */
  opacity: 0.5;
}

.wt-cascader__arrow {
  /* 宽度 */
  width: 0;
  /* 高度 */
  height: 0;
  /* 顶部边框 */
  border-top: 4px solid transparent;
  /* 底部边框 */
  border-bottom: 4px solid transparent;
  /* 左侧边框 */
  border-left: 5px solid currentColor;
}

.wt-cascader__empty {
  /* 文本颜色 */
  color: var(--wt-text-placeholder);
  /* 鼠标指针样式 */
  cursor: default;
  /* 文本对齐方式 */
  text-align: center;
}

.wt-cascader.is-disabled {
  /* 鼠标指针样式 */
  cursor: not-allowed;
  /* 透明度 */
  opacity: 0.6;
}
</style>