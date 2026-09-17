<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { InputNumberProps } from './props'
import { resolveSize } from '../config-provider/context'
import { useHighlightStyle } from '../../utils/highlight'

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

/* 组件级高光参数（优先级高于全局配置） */
const highlightStyle = useHighlightStyle(props)

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

/* 派生状态（计算属性）：精度收敛为非负整数，避免 toFixed 抛 RangeError */
const precision = computed(() =>
  props.precision === undefined ? undefined : Math.max(0, Math.trunc(props.precision))
)

/* 交互处理逻辑 */
const format = (value: number) => {
  const next = precision.value === undefined ? value : Number(value.toFixed(precision.value))
  return String(next)
}

/* 交互处理逻辑 */
const clamp = (value: number) => {
  return Math.min(Math.max(value, props.min), props.max)
}

/* 交互处理逻辑：按步长对齐并夹取到 [min, max] */
const normalize = (value: number) => {
  const aligned = props.step > 0 ? Math.round(value / props.step) * props.step : value
  return clamp(aligned)
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
  /* 空串表示清空：不回写 0 或 min，恢复上一次有效值并同步 emit */
  if (inputValue.value.trim() === '') {
    const restored = clamp(Number(props.modelValue ?? 0))
    inputValue.value = format(restored)
    emit('update:modelValue', restored)
    emit('change', restored)
    return
  }
  const parsed = Number(inputValue.value)
  const next = Number.isNaN(parsed) ? props.min : normalize(parsed)
  inputValue.value = format(next)
  emit('update:modelValue', next)
  emit('change', next)
}

/* 交互处理逻辑 */
const adjust = (direction: 1 | -1) => {
  if (props.disabled || props.readonly) return
  const next = normalize(Number(props.modelValue || 0) + direction * props.step)
  inputValue.value = format(next)
  emit('update:modelValue', next)
  emit('change', next)
}
</script>

<template>
  <div :class="classes" :style="highlightStyle">
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
    <span v-if="controls" class="wt-input-number__controls">
      <button type="button" aria-label="增加" :disabled="disabled || readonly" @click="adjust(1)">+</button>
      <button type="button" aria-label="减少" :disabled="disabled || readonly" @click="adjust(-1)">-</button>
    </span>
  </div>
</template>
<style scoped lang="scss">
@use '@water-ui/theme/src/mixins/index.scss' as wt;

.wt-input-number {
  /* 高光尺寸（随全局基准等比缩放，11px / 12px） */
  --wt-highlight-size: calc(var(--wt-highlight-size-base) * 0.9167);
  /* 次高光尺寸（随全局基准等比缩放，6px / 12px） */
  --wt-highlight-small-size: calc(var(--wt-highlight-size-base) * 0.5);
  /* 高光内边距（随全局偏移等比缩放，6px / 8px） */
  --wt-highlight-inset: calc(var(--wt-highlight-offset) * 0.75);
  /* 水滴高光：定位方式 + 独立层叠上下文 + 主/次高光伪元素（层叠层级 2） */
  @include wt.wt-liquid-highlights(2);
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
  transition: box-shadow var(--wt-motion-fast) ease;
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