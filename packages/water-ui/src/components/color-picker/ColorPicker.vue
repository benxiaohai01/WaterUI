<script setup lang="ts">
import { computed } from 'vue'
import type { ColorPickerProps } from './props'
import { resolveSize } from '../config-provider/context'
import { useHighlightStyle } from '../../utils/highlight'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtColorPicker' })

/* 声明组件入参与默认值 */
const props = withDefaults(defineProps<ColorPickerProps>(), {
  modelValue: '#3d7eff',
  disabled: false,
  customClass: ''
})

/* 声明组件事件 */
const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string]
}>()

/* 解析组件尺寸配置 */
const size = resolveSize(() => props.size)

/* 组件级高光参数（优先级高于全局配置） */
const highlightStyle = useHighlightStyle(props)

/* 派生状态（计算属性） */
const classes = computed(() => [
  'wt-color-picker',
  `wt-color-picker--${size.value}`,
  { 'is-disabled': props.disabled },
  props.customClass
])

/* 派生状态（计算属性） */
const color = computed(() => props.modelValue || '#3d7eff')

/* 交互处理逻辑：校验并归一化十六进制颜色（补 #、转小写），非法值返回空串 */
const normalizeColor = (value: string) => {
  const matched = /^#?([0-9a-f]{6})$/i.exec(value.trim())
  return matched ? `#${matched[1].toLowerCase()}` : ''
}

/* 交互处理逻辑 */
const handleInput = (event: Event) => {
  const next = (event.target as HTMLInputElement).value
  emit('update:modelValue', next)
}

/* 交互处理逻辑：仅合法颜色写回受控值，避免色板与文本不一致 */
const handleTextInput = (event: Event) => {
  const next = normalizeColor((event.target as HTMLInputElement).value)
  if (next) emit('update:modelValue', next)
}

/* 交互处理逻辑：以事件目标值为准归一化，非法输入回退到当前颜色 */
const handleTextChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  const next = normalizeColor(input.value)
  if (!next) {
    input.value = color.value
    return
  }
  input.value = next
  emit('update:modelValue', next)
  emit('change', next)
}
</script>

<template>
  <div :class="classes" :style="highlightStyle">
    <span class="wt-color-picker__swatch" :style="{ backgroundColor: color }">
      <input
        class="wt-color-picker__native"
        type="color"
        :value="color"
        :disabled="disabled"
        :aria-label="`选择颜色 ${color}`"
        @input="handleInput"
        @change="handleTextChange"
      >
    </span>
    <input
      class="wt-color-picker__text"
      :value="modelValue"
      :disabled="disabled"
      spellcheck="false"
      @input="handleTextInput"
      @change="handleTextChange"
    >
  </div>
</template>
<style scoped lang="scss">
.wt-color-picker {
  /* 高光尺寸（随全局基准等比缩放） */
  --wt-highlight-size: calc(var(--wt-highlight-size-base) * 0.9167);
  /* 次高光尺寸（随全局基准等比缩放） */
  --wt-highlight-small-size: calc(var(--wt-highlight-size-base) * 0.5);
  /* 高光内边距（随全局偏移等比缩放） */
  --wt-highlight-inset: calc(var(--wt-highlight-offset) * 0.75);
  /* 定位方式 */
  position: relative;
  /* 创建独立层叠上下文，隔离内部元素 */
  isolation: isolate;
  /* 盒模型显示方式 */
  display: inline-flex;
  /* 交叉轴对齐方式 */
  align-items: center;
  /* 元素间距 */
  gap: 10px;
  /* 宽度 */
  width: 100%;
  /* 最小宽度 */
  min-width: 0;
  /* 内边距 */
  padding: 8px 12px;
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
  /* 动画 */
  animation: wt-liquid-flow-subtle var(--wt-motion-slow) ease-in-out infinite;
}

.wt-color-picker::after {
  /* 伪元素内容 */
  content: '';
  /* 定位方式 */
  position: absolute;
  /* 宽度 */
  width: var(--wt-highlight-size);
  /* 高度 */
  height: var(--wt-highlight-size);
  /* 顶部偏移 */
  top: min(var(--wt-highlight-inset), calc(100% - var(--wt-highlight-size) - 4px));
  /* 右侧偏移 */
  right: min(var(--wt-highlight-inset), calc(100% - var(--wt-highlight-size) - 4px));
  /* 背景 */
  background: var(--wt-highlight);
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: var(--wt-highlight-radius);
  /* 是否响应鼠标事件 */
  pointer-events: none;
  /* 动画 */
  animation: wt-highlight-float var(--wt-motion-normal) ease-in-out infinite;
  /* 透明度 */
  opacity: var(--wt-highlight-opacity);
}

.wt-color-picker::before {
  /* 伪元素内容 */
  content: '';
  /* 定位方式 */
  position: absolute;
  /* 宽度 */
  width: var(--wt-highlight-small-size);
  /* 高度 */
  height: var(--wt-highlight-small-size);
  /* 顶部偏移 */
  top: min(calc(var(--wt-highlight-inset) + var(--wt-highlight-size) + var(--wt-highlight-group-gap)), calc(100% - var(--wt-highlight-small-size) - 4px));
  /* 右侧偏移 */
  right: min(calc(var(--wt-highlight-inset) + var(--wt-highlight-size) + var(--wt-highlight-group-gap)), calc(100% - var(--wt-highlight-small-size) - 4px));
  /* 背景 */
  background: var(--wt-highlight-small);
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: var(--wt-highlight-small-radius);
  /* 是否响应鼠标事件 */
  pointer-events: none;
  /* 动画 */
  animation: wt-highlight-float-small var(--wt-motion-slow) ease-in-out infinite;
  /* 透明度 */
  opacity: var(--wt-highlight-small-opacity);
}

.wt-color-picker__swatch {
  /* 定位方式 */
  position: relative;
  /* 宽度 */
  width: 30px;
  /* 高度 */
  height: 30px;
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: var(--wt-highlight-radius);
  /* 水滴内外部阴影层次 */
  box-shadow:
    inset 2px 3px 6px rgba(0, 0, 0, 0.2),
    inset -1px -1px 3px rgba(255, 255, 255, 0.35);
  /* 溢出裁剪方式 */
  overflow: hidden;
}

.wt-color-picker__native {
  /* 定位方式 */
  position: absolute;
  /* 上下左右偏移合成属性 */
  inset: 0;
  /* 透明度 */
  opacity: 0;
  /* 鼠标指针样式 */
  cursor: pointer;
}

.wt-color-picker__text {
  /* 弹性布局中的伸缩比例 */
  flex: 1;
  /* 最小宽度 */
  min-width: 0;
  /* 边框 */
  border: 0;
  /* 焦点轮廓 */
  outline: 0;
  /* 背景 */
  background: transparent;
  /* 文本颜色 */
  color: var(--wt-text);
  /* 字体族 */
  font-family: inherit;
  /* 字号 */
  font-size: 14px;
  /* 文本大小写转换 */
  text-transform: uppercase;
}

.wt-color-picker.is-disabled {
  /* 鼠标指针样式 */
  cursor: not-allowed;
  /* 透明度 */
  opacity: 0.6;
}
</style>