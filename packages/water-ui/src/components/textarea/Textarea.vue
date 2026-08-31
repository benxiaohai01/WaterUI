<script setup lang="ts">
import { computed } from 'vue'
import type { TextareaProps } from './props'
import { resolveSize } from '../config-provider/context'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtTextarea' })

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

/* 解析组件尺寸配置 */
const size = resolveSize(() => props.size)

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
  <div :class="classes">
    <textarea
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
.wt-textarea {
  /* 高光尺寸 */
  --wt-highlight-size: min(var(--wt-highlight-size-base), 12px);
  /* 次高光尺寸 */
  --wt-highlight-small-size: min(calc(var(--wt-highlight-size-base) * 0.5), 7px);
  /* 高光内边距 */
  --wt-highlight-inset: min(var(--wt-highlight-offset), 6px);
  /* 定位方式 */
  position: relative;
  /* 创建独立层叠上下文，隔离内部元素 */
  isolation: isolate;
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
  transition: box-shadow 0.25s ease, background 0.25s ease;
}

.wt-textarea::after {
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
  /* 层叠层级 */
  z-index: 3;
}

.wt-textarea::before {
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
  /* 层叠层级 */
  z-index: 3;
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