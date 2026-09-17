<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import type { ClassValue, StyleValue } from 'vue'
import type { TextareaProps } from './props'
import { resolveSize } from '../config-provider/context'
import { useHighlightStyle } from '../../utils/highlight'

/* 组件注册名（供全局组件与 DevTools 识别）；关闭默认透传，避免父级 attrs 落到包裹 div */
defineOptions({ name: 'WtTextarea', inheritAttrs: false })

/* 声明组件入参与默认值 */
const props = withDefaults(defineProps<TextareaProps>(), {
  modelValue: '',
  placeholder: '',
  rows: 3,
  disabled: false,
  readonly: false,
  resize: 'none',
  maxlength: undefined,
  showWordLimit: false,
  customClass: ''
})

/* 声明组件事件 */
const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  input: [value: string | number]
  change: [value: string | number]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

/* 透传属性拆分：class/style 留在根元素，其余转发给原生文本域（供 FormItem label 关联与 aria 生效） */
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

/* 组件级高光参数（优先级高于全局配置） */
const highlightStyle = useHighlightStyle(props)

/* 派生状态（计算属性） */
const classes = computed(() => [
  'wt-textarea',
  `wt-textarea--${size.value}`,
  {
    'is-disabled': props.disabled,
    'is-readonly': props.readonly
  },
  props.customClass
])

/* 交互处理逻辑 */
const handleInput = (event: Event) => {
  const next = (event.target as HTMLTextAreaElement).value
  emit('update:modelValue', next)
  emit('input', next)
}

/* 交互处理逻辑 */
const handleChange = (event: Event) => {
  emit('change', (event.target as HTMLTextAreaElement).value)
}
</script>

<template>
  <div :class="classes" :style="[highlightStyle, rootAttrs.style]" v-bind="rootAttrs">
    <textarea
      v-bind="controlAttrs"
      class="wt-textarea__native"
      :value="modelValue"
      :placeholder="placeholder"
      :rows="rows"
      :disabled="disabled"
      :readonly="readonly"
      :maxlength="maxlength"
      :style="{ resize }"
      @input="handleInput"
      @change="handleChange"
      @focus="(event: FocusEvent) => emit('focus', event)"
      @blur="(event: FocusEvent) => emit('blur', event)"
    />
    <span v-if="showWordLimit" class="wt-textarea__count">
      {{ String(modelValue).length }}{{ maxlength !== undefined ? ` / ${maxlength}` : '' }}
    </span>
  </div>
</template>
<style scoped lang="scss">
@use '@water-ui/theme/src/mixins/index.scss' as wt;

.wt-textarea {
  /* 高光尺寸（随全局基准等比缩放，12px 即全局基准） */
  --wt-highlight-size: var(--wt-highlight-size-base);
  /* 次高光尺寸（随全局基准等比缩放，7px / 12px） */
  --wt-highlight-small-size: calc(var(--wt-highlight-size-base) * 0.5 * 1.1667);
  /* 高光内边距（随全局偏移等比缩放，6px / 8px） */
  --wt-highlight-inset: calc(var(--wt-highlight-offset) * 0.75);
  /* 水滴高光：定位方式 + 独立层叠上下文 + 主/次高光伪元素（层叠层级 3） */
  @include wt.wt-liquid-highlights(3);
  /* 盒模型显示方式 */
  display: inline-flex;
  /* 弹性布局主轴方向 */
  flex-direction: column;
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
  transition: box-shadow var(--wt-motion-fast) ease, background var(--wt-motion-fast) ease;
}

.wt-textarea__native {
  /* 弹性布局中的伸缩比例 */
  flex: 1;
  /* 宽度 */
  width: 100%;
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
  /* 行高 */
  line-height: 1.6;
  /* 内边距 */
  padding: 12px 16px;
  /* 文本阴影 */
  text-shadow: var(--wt-text-shadow);
  /* 输入光标颜色 */
  caret-color: var(--wt-primary);
}

.wt-textarea--small .wt-textarea__native {
/* 内边距 */
padding: 8px 12px;
  /* 字号 */
  font-size: 13px;
}
.wt-textarea--large .wt-textarea__native {
/* 内边距 */
padding: 15px 20px;
  /* 字号 */
  font-size: 17px;
}

.wt-textarea__native::placeholder {
  /* 文本颜色 */
  color: var(--wt-text-placeholder);
  /* 文本阴影 */
  text-shadow: none;
}

.wt-textarea__count {
  /* 单个弹性项在交叉轴上的对齐方式 */
  align-self: flex-end;
  /* 内边距 */
  padding: 4px 12px 8px;
  /* 文本颜色 */
  color: var(--wt-text-placeholder);
  /* 字号 */
  font-size: 12px;
}

.wt-textarea.is-disabled {
  /* 鼠标指针样式 */
  cursor: not-allowed;
  /* 透明度 */
  opacity: 0.6;
}

.wt-textarea.is-disabled .wt-textarea__native {
  /* 鼠标指针样式 */
  cursor: not-allowed;
}
</style>