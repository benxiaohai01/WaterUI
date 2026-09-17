<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue'
import type { ClassValue, StyleValue } from 'vue'
import type { InputProps } from './props'
import { resolveSize } from '../config-provider/context'
import { useHighlightStyle } from '../../utils/highlight'

/* 组件注册名（供全局组件与 DevTools 识别）；关闭默认透传，避免父级 attrs 落到包裹 div */
defineOptions({ name: 'WtInput', inheritAttrs: false })

/* 声明组件入参与默认值 */
const props = withDefaults(defineProps<InputProps>(), {
  modelValue: '',
  type: 'text',
  placeholder: '',
  disabled: false,
  readonly: false,
  clearable: false
})

/* 声明组件事件 */
const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  input: [value: string | number]
  change: [value: string | number]
  clear: []
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const inputRef = ref<HTMLInputElement>()

/* 组件级高光参数：显式传入时覆盖全局配置（props.ts 为类型专用导入，改动后需重编译本文件） */
const highlightStyle = useHighlightStyle(props)

/* 透传属性拆分：class/style 留在根元素，其余转发给原生输入框（供 FormItem label 关联与 aria 生效） */
const attrs = useAttrs()
const rootAttrs = computed(() => ({
  class: attrs.class as ClassValue | undefined,
  style: attrs.style as StyleValue | undefined
}))
const controlAttrs = computed(() => {
  const forwarded: Record<string, unknown> = {}
  Object.entries(attrs).forEach(([key, value]) => {
    if (key !== 'class' && key !== 'style') {
      forwarded[key] = value
    }
  })
  return forwarded
})

/* 解析组件尺寸配置 */
const size = resolveSize(() => props.size)

/* 派生状态（计算属性） */
const value = computed(() => props.modelValue)

/* 派生状态（计算属性） */
const classes = computed(() => [
  'wt-input',
  `wt-input--${size.value}`,
  {
    'is-disabled': props.disabled,
    'is-readonly': props.readonly,
    'is-clearable': props.clearable
  },
  props.customClass
])

/* 交互处理逻辑 */
const handleInput = (event: Event) => {
  const next = (event.target as HTMLInputElement).value
  emit('update:modelValue', next)
  emit('input', next)
}

/* 交互处理逻辑 */
const handleChange = (event: Event) => {
  emit('change', (event.target as HTMLInputElement).value)
}

/* 交互处理逻辑 */
const clear = () => {
  emit('update:modelValue', '')
  emit('change', '')
  emit('clear')
  inputRef.value?.focus()
}

defineExpose({
  focus: () => inputRef.value?.focus(),
  blur: () => inputRef.value?.blur()
})
</script>

<template>
  <div :class="classes" :style="[highlightStyle, rootAttrs.style]" v-bind="rootAttrs">
    <span v-if="$slots.prefix" class="wt-input__affix wt-input__prefix" aria-hidden="true">
      <slot name="prefix" />
    </span>
    <input
      ref="inputRef"
      v-bind="controlAttrs"
      class="wt-input__native"
      :type="type"
      :value="value"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      @input="handleInput"
      @change="handleChange"
      @focus="(event: FocusEvent) => emit('focus', event)"
      @blur="(event: FocusEvent) => emit('blur', event)"
    >
    <button
      v-if="clearable && String(value).length && !disabled && !readonly"
      class="wt-input__clear"
      type="button"
      aria-label="清空"
      @click="clear"
    >
      ×
    </button>
    <span v-if="$slots.suffix" class="wt-input__affix wt-input__suffix" aria-hidden="true">
      <slot name="suffix" />
    </span>
  </div>
</template>
<style scoped lang="scss">
@use '@water-ui/theme/src/mixins/index.scss' as wt;

.wt-input {
  /* 高光尺寸（随全局基准等比缩放） */
  --wt-highlight-size: calc(var(--wt-highlight-size-base) * 0.9167);
  /* 次高光尺寸 */
  --wt-highlight-small-size: calc(var(--wt-highlight-size-base) * 0.5);
  /* 高光内边距（随全局偏移等比缩放） */
  --wt-highlight-inset: calc(var(--wt-highlight-offset) * 0.75);
  /* 水滴高光：定位方式 + 独立层叠上下文 + 主/次高光伪元素（层叠层级 3） */
  @include wt.wt-liquid-highlights(3);
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
  /* 液体形变动画（含 will-change: transform） */
  @include wt.wt-liquid-animation(wt-liquid-flow-subtle, var(--wt-motion-slow), transform);
  /* 过渡动画 */
  transition: box-shadow var(--wt-motion-fast) ease, background var(--wt-motion-fast) ease;
}

.wt-input:focus-within {
  /* 水滴内外部阴影层次 */
  box-shadow:
    inset 4px 5px 10px rgba(0, 0, 0, 0.2),
    inset -3px -3px 6px var(--wt-shadow-light),
    4px 6px 16px rgba(0, 0, 0, 0.15),
    0 0 0 2px color-mix(in srgb, var(--wt-primary) 38%, transparent);
}

.wt-input__native {
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

.wt-input--small .wt-input__native {
/* 内边距 */
padding: 7px 12px;
  /* 字号 */
  font-size: 13px;
}
.wt-input--large .wt-input__native {
/* 内边距 */
padding: 14px 20px;
  /* 字号 */
  font-size: 17px;
}

.wt-input__native::placeholder {
  /* 文本颜色 */
  color: var(--wt-text-placeholder);
  /* 文本阴影 */
  text-shadow: none;
}

.wt-input__affix {
  /* 盒模型显示方式 */
  display: inline-flex;
  /* 交叉轴对齐方式 */
  align-items: center;
  /* 文本颜色 */
  color: var(--wt-text-secondary);
}

.wt-input__prefix {
  /* 左侧内边距 */
  padding-left: 14px;
}

.wt-input__suffix {
  /* 右侧内边距 */
  padding-right: 14px;
}

.wt-input__clear {
  /* 边框 */
  border: 0;
  /* 背景 */
  background: transparent;
  /* 文本颜色 */
  color: var(--wt-text-placeholder);
  /* 字号 */
  font-size: 18px;
  /* 行高 */
  line-height: 1;
  /* 鼠标指针样式 */
  cursor: pointer;
  /* 内边距 */
  padding: 0 12px 0 0;
}

.wt-input.is-disabled {
  /* 鼠标指针样式 */
  cursor: not-allowed;
  /* 透明度 */
  opacity: 0.6;
}

.wt-input.is-disabled .wt-input__native {
  /* 鼠标指针样式 */
  cursor: not-allowed;
}
</style>