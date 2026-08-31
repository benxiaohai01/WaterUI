<script setup lang="ts">
import { computed } from 'vue'
import type { DatePickerProps } from './props'
import { resolveSize } from '../config-provider/context'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtDatePicker' })

/* 声明组件入参与默认值 */
const props = withDefaults(defineProps<DatePickerProps>(), {
  modelValue: '',
  placeholder: '',
  disabled: false,
  readonly: false,
  clearable: false,
  pickerType: 'date',
  customClass: ''
})

/* 声明组件事件 */
const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string]
  clear: []
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

/* 解析组件尺寸配置 */
const size = resolveSize(() => props.size)

/* 派生状态（计算属性） */
const classes = computed(() => [
  'wt-date-picker',
  `wt-date-picker--${size.value}`,
  {
    'is-disabled': props.disabled,
    'is-readonly': props.readonly,
    'is-clearable': props.clearable
  },
  props.customClass
])

/* 派生状态（计算属性） */
const nativeType = computed(() => (props.pickerType === 'datetime' ? 'datetime-local' : 'date'))

/* 交互处理逻辑 */
const handleInput = (event: Event) => {
  const next = (event.target as HTMLInputElement).value
  emit('update:modelValue', next)
}

/* 交互处理逻辑 */
const handleChange = (event: Event) => {
  emit('change', (event.target as HTMLInputElement).value)
}

/* 交互处理逻辑 */
const clear = () => {
  emit('update:modelValue', '')
  emit('clear')
}
</script>

<template>
  <div :class="classes">
    <input
      class="wt-date-picker__native"
      :type="nativeType"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      @input="handleInput"
      @change="handleChange"
      @focus="(event: FocusEvent) => emit('focus', event)"
      @blur="(event: FocusEvent) => emit('blur', event)"
    >
    <button
      v-if="clearable && modelValue"
      class="wt-date-picker__clear"
      type="button"
      aria-label="清空"
      @click="clear"
    >
      ×
    </button>
  </div>
</template>
<style scoped lang="scss">
.wt-date-picker {
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
  gap: 6px;
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

.wt-date-picker::after,
.wt-date-picker::before {
  /* 伪元素内容 */
  content: '';
  /* 定位方式 */
  position: absolute;
  /* 是否响应鼠标事件 */
  pointer-events: none;
  /* 层叠层级 */
  z-index: 2;
}

.wt-date-picker::after {
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

.wt-date-picker::before {
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

.wt-date-picker__native {
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
  /* 颜色方案（跟随明暗主题） */
  color-scheme: light dark;
}

.wt-date-picker--small .wt-date-picker__native {
/* 内边距 */
padding: 7px 12px;
  /* 字号 */
  font-size: 13px;
}
.wt-date-picker--large .wt-date-picker__native {
/* 内边距 */
padding: 14px 20px;
  /* 字号 */
  font-size: 17px;
}

.wt-date-picker.is-clearable .wt-date-picker__native {
  /* 右侧内边距 */
  padding-right: 76px;
}

.wt-date-picker__clear {
  /* 定位方式 */
  position: absolute;
  /* 顶部偏移 */
  top: 50%;
  /* 右侧偏移 */
  right: 42px;
  /* 层叠层级 */
  z-index: 3;
  /* 边框 */
  border: 0;
  /* 背景 */
  background: transparent;
  /* 文本颜色 */
  color: var(--wt-text-placeholder);
  /* 字号 */
  font-size: 18px;
  /* 形变 */
  transform: translateY(-50%);
  /* 鼠标指针样式 */
  cursor: pointer;
}

.wt-date-picker.is-disabled {
  /* 鼠标指针样式 */
  cursor: not-allowed;
  /* 透明度 */
  opacity: 0.6;
}
</style>