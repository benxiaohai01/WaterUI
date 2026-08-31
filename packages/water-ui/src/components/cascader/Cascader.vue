<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import type { CascaderOption, CascaderProps } from './props'
import { resolveSize } from '../config-provider/context'

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
const viewOptions = ref<CascaderOption[]>(props.options)
const breadcrumb = ref<CascaderOption[]>([])

/* 解析组件尺寸配置 */
const size = resolveSize(() => props.size)

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

/* 派生状态（计算属性） */
const selectedPath = computed(() => findPath(props.options, props.modelValue))

/* 派生状态（计算属性） */
const display = computed(() => {
  if (selectedPath.value.length) return selectedPath.value.map((item) => item.label).join(' / ')
  return breadcrumb.value.map((item) => item.label).join(' / ')
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

/* 交互处理逻辑 */
const toggle = () => {
  if (props.disabled) return
  open.value = !open.value
  if (open.value) {
    viewOptions.value = props.options
    breadcrumb.value = []
  }
}

/* 交互处理逻辑 */
const enter = (option: CascaderOption) => {
  if (option.disabled) return
  if (option.children?.length) {
    breadcrumb.value.push(option)
    viewOptions.value = option.children
    return
  }
  const next = [...breadcrumb.value.map((item) => item.value), option.value]
  emit('update:modelValue', next)
  emit('change', next)
  open.value = false
}

/* 交互处理逻辑 */
const back = () => {
  if (!breadcrumb.value.length) {
    open.value = false
    return
  }
  breadcrumb.value.pop()
  const parent = breadcrumb.value.at(-1)
  viewOptions.value = parent?.children || props.options
}

/* 交互处理逻辑 */
const clear = () => {
  emit('update:modelValue', [])
  emit('clear')
}

/* 交互处理逻辑 */
const handleOutside = (event: PointerEvent) => {
  if (rootRef.value && !rootRef.value.contains(event.target as Node)) {
    open.value = false
  }
}

onMounted(() => document.addEventListener('pointerdown', handleOutside))
onBeforeUnmount(() => document.removeEventListener('pointerdown', handleOutside))
</script>

<template>
  <div ref="rootRef" :class="classes">
    <div class="wt-cascader__trigger" role="button" tabindex="0" @click="toggle" @keydown.enter.prevent="toggle">
      <span class="wt-cascader__value" :class="{ 'is-placeholder': !display }">
        {{ display || placeholder }}
      </span>
      <button
        v-if="clearable && modelValue.length"
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
      <div v-if="breadcrumb.length" class="wt-cascader__breadcrumb">
        <button type="button" @click="back">上一级</button>
        <span v-for="item in breadcrumb" :key="String(item.value)">{{ item.label }}</span>
      </div>
      <ul class="wt-cascader__list">
        <li v-if="!viewOptions.length" class="wt-cascader__empty">暂无选项</li>
        <li
          v-for="option in viewOptions"
          :key="String(option.value)"
          class="wt-cascader__option"
          :class="{ 'is-disabled': option.disabled }"
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
.wt-cascader {
  /* 高光尺寸 */
  --wt-highlight-size: min(var(--wt-highlight-size-base), 11px);
  /* 次高光尺寸 */
  --wt-highlight-small-size: min(calc(var(--wt-highlight-size-base) * 0.5), 6px);
  /* 高光内边距 */
  --wt-highlight-inset: min(var(--wt-highlight-offset), 6px);
  /* 定位方式 */
  position: relative;
  /* 创建独立层叠上下文，隔离内部元素 */
  isolation: isolate;
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

.wt-cascader::after,
.wt-cascader::before {
  /* 伪元素内容 */
  content: '';
  /* 定位方式 */
  position: absolute;
  /* 是否响应鼠标事件 */
  pointer-events: none;
  /* 层叠层级 */
  z-index: 1;
}

.wt-cascader::after {
  /* 宽度 */
  width: var(--wt-highlight-size);
  /* 高度 */
  height: var(--wt-highlight-size);
  /* 顶部偏移 */
  top: var(--wt-highlight-top);
  /* 右侧偏移 */
  right: var(--wt-highlight-right);
  /* 背景 */
  background: var(--wt-highlight);
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: var(--wt-highlight-radius);
  /* 动画 */
  animation: wt-highlight-float var(--wt-motion-normal) ease-in-out infinite;
  /* 透明度 */
  opacity: var(--wt-highlight-opacity);
}

.wt-cascader::before {
  /* 宽度 */
  width: var(--wt-highlight-small-size);
  /* 高度 */
  height: var(--wt-highlight-small-size);
  /* 顶部偏移 */
  top: var(--wt-highlight-small-top);
  /* 右侧偏移 */
  right: var(--wt-highlight-small-right);
  /* 背景 */
  background: var(--wt-highlight-small);
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: var(--wt-highlight-small-radius);
  /* 动画 */
  animation: wt-highlight-float-small var(--wt-motion-slow) ease-in-out infinite;
  /* 透明度 */
  opacity: var(--wt-highlight-small-opacity);
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
  transition: transform 0.2s ease;
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

.wt-cascader__option:hover {
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