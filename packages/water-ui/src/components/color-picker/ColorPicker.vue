<script setup lang="ts">
import { computed } from 'vue'
import type { ColorPickerProps } from './props'
import { resolveSize } from '../config-provider/context'

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

/* 派生状态（计算属性） */
const classes = computed(() => [
  'wt-color-picker',
  `wt-color-picker--${size.value}`,
  { 'is-disabled': props.disabled },
  props.customClass
])

/* 派生状态（计算属性） */
const color = computed(() => props.modelValue || '#3d7eff')

/* 交互处理逻辑 */
const handleInput = (event: Event) => {
  const next = (event.target as HTMLInputElement).value
  emit('update:modelValue', next)
}

/* 交互处理逻辑 */
const handleTextInput = (event: Event) => {
  const next = (event.target as HTMLInputElement).value
  emit('update:modelValue', next)
}

/* 交互处理逻辑 */
const handleTextChange = () => {
  emit('change', props.modelValue)
}
</script>

<template>
  <div :class="classes">
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
  top: var(--wt-highlight-top);
  /* 右侧偏移 */
  right: var(--wt-highlight-right);
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
  top: var(--wt-highlight-small-top);
  /* 右侧偏移 */
  right: var(--wt-highlight-small-right);
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