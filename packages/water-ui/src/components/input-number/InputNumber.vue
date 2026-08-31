<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { InputNumberProps } from './props'
import { resolveSize } from '../config-provider/context'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtInputNumber' })

/* 声明组件入参与默认值 */
const props = withDefaults(defineProps<InputNumberProps>(), {
  modelValue: 0,
  min: -Infinity,
  max: Infinity,
  step: 1,
  precision: undefined,
  placeholder: '',
  disabled: false,
  readonly: false,
  controls: true,
  customClass: ''
})

/* 声明组件事件 */
const emit = defineEmits<{
  'update:modelValue': [value: number]
  change: [value: number]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

/* 响应式状态 */
const inputValue = ref(String(props.modelValue))

/* 解析组件尺寸配置 */
const size = resolveSize(() => props.size)

/* 派生状态（计算属性） */
const classes = computed(() => [
  'wt-input-number',
  `wt-input-number--${size.value}`,
  {
    'is-disabled': props.disabled,
    'is-readonly': props.readonly,
    'has-controls': props.controls
  },
  props.customClass
])

/* 交互处理逻辑 */
const format = (value: number) => {
  const next = props.precision === undefined ? value : Number(value.toFixed(props.precision))
  return String(next)
}

/* 交互处理逻辑 */
const clamp = (value: number) => {
  return Math.min(Math.max(value, props.min), props.max)
}

watch(
  () => props.modelValue,
  (value) => {
    inputValue.value = format(Number(value ?? 0))
  }
)

/* 交互处理逻辑 */
const handleInput = (event: Event) => {
  const next = (event.target as HTMLInputElement).value
  inputValue.value = next
  const parsed = Number(next)
  if (next !== '' && !Number.isNaN(parsed)) {
    emit('update:modelValue', clamp(parsed))
  }
}

/* 交互处理逻辑 */
const handleChange = () => {
  const parsed = Number(inputValue.value)
  const next = Number.isNaN(parsed) ? props.min : clamp(parsed)
  inputValue.value = format(next)
  emit('update:modelValue', next)
  emit('change', next)
}

/* 交互处理逻辑 */
const adjust = (direction: 1 | -1) => {
  if (props.disabled || props.readonly) return
  const next = clamp(Number(props.modelValue || 0) + direction * props.step)
  inputValue.value = format(next)
  emit('update:modelValue', next)
  emit('change', next)
}
</script>

<template>
  <div :class="classes">
    <input
      class="wt-input-number__native"
      inputmode="decimal"
      :value="inputValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      @input="handleInput"
      @change="handleChange"
      @focus="(event: FocusEvent) => emit('focus', event)"
      @blur="(event: FocusEvent) => emit('blur', event)"
    >
    <span v-if="controls" class="wt-input-number__controls" aria-hidden="true">
      <button type="button" aria-label="增加" :disabled="disabled || readonly" @click="adjust(1)">+</button>
      <button type="button" aria-label="减少" :disabled="disabled || readonly" @click="adjust(-1)">-</button>
    </span>
  </div>
</template>
<style scoped lang="scss">
.wt-input-number {
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
  /* 宽度 */
  width: 100%;
  /* 最小宽度 */
  min-width: 0;
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
  /* 过渡动画 */
  transition: box-shadow 0.25s ease;
}

.wt-input-number::after,
.wt-input-number::before {
  /* 伪元素内容 */
  content: '';
  /* 定位方式 */
  position: absolute;
  /* 是否响应鼠标事件 */
  pointer-events: none;
  /* 层叠层级 */
  z-index: 2;
}

.wt-input-number::after {
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

.wt-input-number::before {
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

.wt-input-number__native {
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
  font-size: 15px;
  /* 内边距 */
  padding: 11px 16px;
  /* 文本阴影 */
  text-shadow: var(--wt-text-shadow);
  /* 输入光标颜色 */
  caret-color: var(--wt-primary);
}

.wt-input-number--small .wt-input-number__native {
/* 内边距 */
padding: 7px 12px;
  /* 字号 */
  font-size: 13px;
}
.wt-input-number--large .wt-input-number__native {
/* 内边距 */
padding: 14px 20px;
  /* 字号 */
  font-size: 17px;
}

.wt-input-number__native::placeholder {
  /* 文本颜色 */
  color: var(--wt-text-placeholder);
  /* 文本阴影 */
  text-shadow: none;
}

.wt-input-number__controls {
  /* 盒模型显示方式 */
  display: inline-flex;
  /* 弹性布局主轴方向 */
  flex-direction: column;
  /* 右侧外边距 */
  margin-right: 6px;
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: var(--wt-radius-sm);
  /* 溢出裁剪方式 */
  overflow: hidden;
}

.wt-input-number__controls button {
  /* 宽度 */
  width: 34px;
  /* 高度 */
  height: 20px;
  /* 边框 */
  border: 0;
  /* 背景 */
  background: transparent;
  /* 文本颜色 */
  color: var(--wt-text-secondary);
  /* 字号 */
  font-size: 15px;
  /* 行高 */
  line-height: 1;
  /* 鼠标指针样式 */
  cursor: pointer;
}

.wt-input-number__controls button:hover {
  /* 文本颜色 */
  color: var(--wt-primary);
}

.wt-input-number.is-disabled {
  /* 鼠标指针样式 */
  cursor: not-allowed;
  /* 透明度 */
  opacity: 0.6;
}
</style>